import AWS from 'aws-sdk';
import Web3 from 'web3';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
  endpoint: process.env.WEBSOCKET_ENDPOINT, // You should set this to your WebSocket API Gateway endpoint
});

const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.WEBSOCKET_PROVIDER_URL));

let contracts = []; // State stored in memory - consider moving to a DB for production

// Handler function
export const handler = async (event) => {
  const { httpMethod, path } = event;

  if (httpMethod === 'GET' && path === '/api/contracts') {
    // Handle the /api/contracts GET request
    console.log('GET /api/contracts called');
    return {
      statusCode: 200,
      body: JSON.stringify(contracts),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  // Handle other paths or methods (like WebSocket events)
  return {
    statusCode: 404,
    body: JSON.stringify({ message: 'Not Found' }),
  };
};

// erc20 abi for contract interaction
const erc20ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{ "name": "", "type": "string" }],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "name": "", "type": "uint256" }],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "payable": false,
    "type": "function"
  }
];

// Function to handle new connections
export const connectHandler = async (event) => {
  console.log(`Connection established: ${event.requestContext.connectionId}`);
  // You can store the connection ID to DynamoDB or another store if you need to track connections
  return { statusCode: 200, body: 'Connected.' };
};

// Function to handle disconnections
export const disconnectHandler = async (event) => {
  console.log(`Connection closed: ${event.requestContext.connectionId}`);
  // Clean up resources if necessary (e.g., remove connection ID from storage)
  return { statusCode: 200, body: 'Disconnected.' };
};

// Function to broadcast new contracts to all connected clients
export const broadcastNewContractHandler = async (event) => {
  const { connectionId } = event.requestContext;
  const { action } = JSON.parse(event.body);

  if (action === 'subscribeToBlocks') {
    try {
      web3.eth.subscribe('newBlockHeaders', async (error, blockHeader) => {
        if (error) {
          console.error('Error subscribing to newBlockHeaders:', error);
          return;
        }
        console.log(`New block received: ${blockHeader.number}`);
        await processBlock(blockHeader.number);
      });

      return { statusCode: 200, body: 'Subscribed to new blocks.' };
    } catch (error) {
      console.error('Subscription error:', error.message);
      return { statusCode: 500, body: 'Failed to subscribe to blocks.' };
    }
  } else {
    return { statusCode: 400, body: 'Unknown action.' };
  }
};

// Process the block and find contracts
async function processBlock(blockNumber) {
  const block = await web3.eth.getBlock(blockNumber, true);
  console.log(`Processing block: ${blockNumber}, transactions: ${block.transactions.length}`);
  for (const tx of block.transactions) {
    if (!tx.to) {
      console.log(`Found contract creation tx: ${tx.hash}`);
      await checkForERC20(tx, block);
    }
  }
}

// Check if a contract is an ERC20 contract
async function checkForERC20(tx, block) {
  const receipt = await web3.eth.getTransactionReceipt(tx.hash);
  if (receipt && receipt.contractAddress) {
    console.log(`Contract created at: ${receipt.contractAddress}`);
    const isErc20 = await isERC20(receipt.contractAddress);
    console.log(`Is it ERC20? ${isErc20}`);
    if (isErc20) {
      const tokenName = await getTokenName(receipt.contractAddress);
      const telegramLink = await getTelegramLink(receipt.contractAddress);
      const contractInfo = {
        address: receipt.contractAddress,
        transactionHash: tx.hash,
        blockNumber: block.number,
        timestamp: block.timestamp,
        name: tokenName || `Token at ${receipt.contractAddress}`,
        telegramLink: telegramLink,
        possibleTelegramLink: !telegramLink && tokenName ? `https://t.me/${tokenName.replace(/\s+/g, '')}` : null
      };
      console.log(`ERC20 contract deployed at: ${receipt.contractAddress}`);

      contracts.push(contractInfo);
      if (contracts.length > 5) {
        contracts.shift();
      }

      await broadcastToAllClients(contractInfo);
    }
  }
}

// Broadcast new contract information to all connected clients
async function broadcastToAllClients(contract) {
  const postCalls = wss.clients.map(async (clientId) => {
    try {
      await apiGatewayManagementApi.postToConnection({
        ConnectionId: clientId,
        Data: JSON.stringify([contract]),
      }).promise();
    } catch (error) {
      console.error(`Failed to send message to ${clientId}: ${error.message}`);
    }
  });

  await Promise.all(postCalls);
}

// Check if contract address is ERC20
async function isERC20(contractAddress) {
  const contract = new web3.eth.Contract(erc20ABI, contractAddress);
  try {
    await contract.methods.totalSupply().call();
    await contract.methods.balanceOf('0x0000000000000000000000000000000000000000').call();
    return true;
  } catch (error) {
    console.error(`Error checking ERC20 at ${contractAddress}:`, error.message);
    return false;
  }
}

// Get token name
async function getTokenName(contractAddress) {
  const contract = new web3.eth.Contract(erc20ABI, contractAddress);
  try {
    return await contract.methods.name().call();
  } catch (error) {
    console.error(`Error fetching token name at ${contractAddress}:`, error.message);
    return null;
  }
}

// Get Telegram link
async function getTelegramLink(contractAddress) {
  try {
    const response = await axios.get(`https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=YourEtherscanAPIKey`);
    const sourceCode = response.data.result[0].SourceCode;
    const telegramLinkMatch = sourceCode.match(/https:\/\/t\.me\/[^\s'"]+/);
    return telegramLinkMatch ? telegramLinkMatch[0] : null;
  } catch (error) {
    console.error(`Error fetching source code for ${contractAddress}:`, error.message);
    return null;
  }
}

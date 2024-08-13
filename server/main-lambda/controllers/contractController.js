import * as db from './dbController.js';

export const getUserContracts = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).send('User ID is required');
  }

  try {
    const contracts = await db.getUserContracts(userId);
    res.status(200).json({
      userId,
      contracts
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

export const addContract = async (req, res) => {
  const { userId, contractAddress, contractName } = req.body;

  if (!userId || !contractAddress || !contractName) {
    return res.status(400).send('User ID, contract address, and contract name are required');
  }

  try {
    const existingContract = await db.checkContractAddress(userId, contractAddress);
    if (existingContract) {
      return res.status(409).send('Contract address already exists for this user');
    }

    const newContract = await db.addContractToUser(userId, contractAddress, contractName);
    res.status(201).json(newContract);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};


export const removeContract = async (req, res) => {
  const { userId, contractAddress } = req.body;
  
  try {
    const deletedContract = await db.removeContractFromUser(userId, contractAddress);
    if (deletedContract) {
      res.status(200).send('Contract address removed successfully.');
    } else {
      res.status(404).send('Contract address not found.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error removing contract address.');
  }
};
import axios from 'axios';

export const liveCoin = async (req, res) => {
    console.log('API Key:', process.env.API_KEY);
    const { address } = req.query;
    try {
      const response = await axios.get(`https://deep-index.moralis.io/api/v2.2/erc20/${address}/price`, {
        headers: {
          'X-API-Key': `${process.env.API_KEY}`
        }
      });
      console.log(response.data);
      res.json(response.data);
    } catch (error) {
      console.error('Error fetchin data from Moralis API:', error);
      res.status(500).send('Error fetching data from Moralis API');
    }
  };
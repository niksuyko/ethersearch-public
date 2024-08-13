import NodeCache from 'node-cache'
const cache = new NodeCache({ stdTTL: 1200 });
import axios from 'axios';

export const trending = async (req, res) => {
    try {
        // Check if the data is in the cache
        const cachedData = cache.get('trendingData');
        if (cachedData) {
            console.log('Returning cached data');
            return res.json(cachedData);
        }

        // If not in cache, make the API call
        const response = await axios.get('https://deep-index.moralis.io/api/v2.2/market-data/erc20s/top-movers', {
            headers: {
                'X-API-Key': `${process.env.API_KEY}`
            }
        });

        // Store the API response in the cache
        cache.set('trendingData', response.data);
        console.log('Data fetched from API and cached');

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data from Moralis API:', error);
        res.status(500).send('Error fetching data from Moralis API');
    }
};
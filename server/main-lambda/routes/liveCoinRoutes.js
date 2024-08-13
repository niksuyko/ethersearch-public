import express from 'express';
import { liveCoin } from '../controllers/liveCoinController.js';

const router = express.Router();

router.get('/', liveCoin);

export default router;
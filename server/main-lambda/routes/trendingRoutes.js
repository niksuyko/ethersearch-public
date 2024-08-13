import express from 'express';
import { trending } from '../controllers/trendingController.js';

const router = express.Router();

router.get('/', trending);

export default router;
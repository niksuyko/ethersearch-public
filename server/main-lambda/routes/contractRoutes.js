import express from 'express';
import { getUserContracts, addContract, removeContract } from '../controllers/contractController.js';

const router = express.Router();

router.get('/getUserContracts', getUserContracts);
router.post('/addContract', addContract);
router.post('/removeContract', removeContract);

export default router;

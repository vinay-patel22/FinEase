import express from 'express';
import { getTransactions, addTransaction, getIncome, getExpenses, updateTransaction, deleteTransaction } from '../controllers/transactionController';

const router = express.Router();

router.get('/', getTransactions);
router.post('/', addTransaction);
router.get('/income', getIncome);
router.get('/expenses', getExpenses);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;

import { Router } from 'express';

// import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();

  return response.json({transactions: transactions, balance})
});

transactionsRouter.post('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const { title, value, type, category } = request.body;

  const newTransaction = new CreateTransactionService();

  await transactionsRepository.getBalance();
  const transaction = await newTransaction.execute({title, value, type, category});

  console.log(transaction);

  return response.json(transaction);

});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;

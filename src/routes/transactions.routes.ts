import { Router } from 'express';

// import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import DeleteTransactionService from '../services/DeleteTransactionService';
import uploadConfig from '../config/upload';
import multer from 'multer';
import ImportTransactionsService from '../services/ImportTransactionsService';

// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const upload = multer(uploadConfig);


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

  const { id } = request.params;

  await new DeleteTransactionService().execute(id);

  return response.status(204).send();
});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const newImport = new ImportTransactionsService();

  console.log(request.file);

  const transactions = await newImport.execute({file: request.file.path});

  return response.json(transactions)

});

export default transactionsRouter;

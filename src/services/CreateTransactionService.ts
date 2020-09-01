import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import { getRepository, getCustomRepository } from 'typeorm';
import Category from '../models/Category';


interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if(type !== 'income' && type !== 'outcome') {
      throw new AppError('Type can only be income or outcome', 401);
    }

    if(type === 'outcome' && value > total) {
      throw new AppError('Outcome cannot be higher than income.', 400);
    }

    let findCategory = await categoryRepository.findOne({where: {title: category}});

    if(!findCategory) {
      findCategory = categoryRepository.create({
        title: category
      });
      await categoryRepository.save(findCategory);
    }

    await transactionsRepository.getBalance();

    const newTransaction = transactionsRepository.create({
      title,
      value,
      type,
      category: findCategory
    });

    await transactionsRepository.save(newTransaction)

    return newTransaction

  }
}

export default CreateTransactionService;

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

    if(type !== 'income' && type !== 'outcome') {
      throw new AppError('Type can only be income or outcome', 401);
    }

    const findCategory = await categoryRepository.findOne({where: {title: category}});
    let categoryId;

    if(!findCategory) {
      const newCategory = categoryRepository.create({
        title: category
      });
      await categoryRepository.save(newCategory);
      categoryId = newCategory.id;
    } else {
      categoryId = findCategory.id;
    }

    console.log(categoryId)

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryId
    });

    await transactionsRepository.save(transaction)



    return transaction

  }
}

export default CreateTransactionService;

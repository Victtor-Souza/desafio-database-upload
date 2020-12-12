import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsIncome = await this.find({ where: { type: 'income' } });
    const transactionsOutcome = await this.find({ where: { type: 'outcome' } });

    const totalIncome =
      transactionsIncome.length > 0
        ? transactionsIncome.map(x => x.value).reduce((a, b) => a + b)
        : 0;
    const totalOutcome =
      transactionsOutcome.length > 0
        ? transactionsOutcome.map(x => x.value).reduce((a, b) => a + b)
        : 0;

    const total = totalIncome - totalOutcome;
    const balance: Balance = {
      income: totalIncome,
      outcome: totalOutcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;

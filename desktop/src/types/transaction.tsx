import { Account } from './account';

export type Transaction = {
    id: number,
    date: Date,
    vendor: string,
    accountIndex: number,
    description: string,
    amount: number
}
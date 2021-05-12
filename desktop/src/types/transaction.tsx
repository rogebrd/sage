export type Transaction = {
    id: number,
    date: Date,
    vendor: string,
    account: Account,
    description: string,
    amount: number
}
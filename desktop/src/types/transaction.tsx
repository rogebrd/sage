export type Transaction = {
    id: number,
    vendor: string,
    account: Account,
    description: string,
    amount: number
}
export type Transaction = {
    id: number,
    date: Date,
    vendor: string,
    accountIndex: number,
    amount: number,
    category?: string,
}
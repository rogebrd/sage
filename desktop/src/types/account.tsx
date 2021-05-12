export type Account = {
    id: number,
    name: string,
    balance: number,
    type: AccountType
}

export enum AccountType {
    Cash,
    Investment,
    Liability,
}
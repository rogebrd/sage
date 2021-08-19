import { Account, AccountCurrency } from "../types/account";

export const formatDate = (date: Date) => (
    date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
export const formatAccountBalance = (account: Account) => (
    `${(account.balance < 0) ? '-' : ''}
    ${(account.currency === AccountCurrency.USD) ? '$' : ''}
    ${(account.currency === AccountCurrency.POINT) ?
        account.balance.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' pts' : Math.abs(account.balance).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
)

export const formatHeaderBalance = (amount: number) => (
    `${(amount < 0) ? '-' : ''}$${Math.abs(amount).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
)
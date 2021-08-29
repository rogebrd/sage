import { LocalAtm, Star, Equalizer, CreditCard } from "@material-ui/icons";
import React from "react";
import { Account, AccountCurrency, AccountType } from "../types/account";

export const formatDate = (date: Date) => (
    date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
export const formatAccountBalance = (account: Account) => {
    let balance = account.getBalance()[account.type];
    return (`${(balance < 0) ? '-' : ''}
    ${(account.currency === AccountCurrency.USD) ? '$' : ''}
    ${(account.currency === AccountCurrency.POINT) ?
            balance.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' pts' : Math.abs(balance).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
    )
}

export const formatHeaderBalance = (amount: number, type: AccountType) => (
    `${(amount < 0) ? '-' : ''}$${Math.abs(amount).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
)

export const formatBalance = (balance: number, type: AccountType) => (
    `${(balance < 0) ? '-' : ''}
    ${(type === AccountType.POINT) ? '' : '$'}
    ${(type === AccountType.POINT) ?
        balance.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' pts' : Math.abs(balance).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
)

export const renderAccountTypeIcon = (accountType: AccountType) => {
    if (accountType === AccountType.CASH) {
        return (<LocalAtm />)
    }
    if (accountType === AccountType.POINT) {
        return (<Star />)
    }
    if (accountType === AccountType.INVESTMENT) {
        return (<Equalizer />)
    }
    if (accountType === AccountType.LIABILITY) {
        return (<CreditCard />)
    }
}
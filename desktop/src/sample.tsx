import { Account, AccountType, AccountCurrency } from "./types/account";
import { Action, ActionStyle } from "./types/action";
import { Transaction } from "./types/transaction";

export const sampleAccounts: Account[] = [
    new Account({
        id: "1",
        name: "Cash",
        balance: 0.0,
        type: AccountType.CASH,
        currency: AccountCurrency.USD
    }),
    new Account({
        id: "2",
        name: "Amex",
        balance: 0.0,
        type: AccountType.LIABILITY,
        currency: AccountCurrency.USD
    }),
    new Account({
        id: "3",
        name: "Checking",
        balance: 0.0,
        type: AccountType.CASH,
        currency: AccountCurrency.USD
    }),
    new Account({
        id: "4",
        name: "Savings",
        balance: 0.0,
        type: AccountType.CASH,
        currency: AccountCurrency.USD
    }),
    new Account({
        id: "5",
        name: "Robinhood",
        balance: 0.0,
        type: AccountType.INVESTMENT,
        currency: AccountCurrency.USD
    }),
];

export const sampleActions: Action[] = [
    new Action({
        id: "1",
        accountId: "2",
        style: ActionStyle.CREDIT,
        amount: 25.00,
        transactionId: "1",
        date: new Date()
    }),
    new Action({
        id: "2",
        accountId: "J.C. Deli",
        style: ActionStyle.DEBIT,
        amount: 25.00,
        transactionId: "1",
        date: new Date()
    }),
];

export const sampleTransactions: Transaction[] = [
    new Transaction({
        id: "1",
        actions: sampleActions
    })
];
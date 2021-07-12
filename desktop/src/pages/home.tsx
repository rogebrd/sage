import React, { FunctionComponent, useEffect, useState } from 'react';
import { AccountTable } from '../components/accountTable';
import { AddAccountModal } from '../components/addAccountModal';
import { Header } from '../components/base/header';
import { TransactionTable } from '../components/transactionTable';
import { Transaction } from '../types/transaction';
import { Account } from '../types/account';
import { AddTransactionModal } from '../components/addTransactionModal';

export const HomePage: FunctionComponent = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        let accountTotals = Array(accounts.length).fill(0);
        transactions.forEach((transaction) => {
            accountTotals[transaction.accountIndex] = accountTotals[transaction.accountIndex] + transaction.amount;
        });
        let newAccounts = Array(accounts.length).fill(null);
        accounts.forEach((account, index) => {
            newAccounts[index] = account;
            newAccounts[index].balance = accountTotals[index];
        });
        setAccounts(accounts);
    }, [accounts, transactions]);

    useEffect(() => {
        setAccounts([
            {
                id: 1,
                name: "Cash",
                balance: 0.0,
                type: "Cash"
            },
            {
                id: 2,
                name: "Amex",
                balance: 0.0,
                type: "Liability"
            },
            {
                id: 3,
                name: "Checking",
                balance: 0.0,
                type: "Cash"
            },
            {
                id: 4,
                name: "Savings",
                balance: 0.0,
                type: "Cash"
            },
            {
                id: 5,
                name: "Robinhood",
                balance: 0.0,
                type: "Investment"
            },
        ]);
        setTransactions([
            {
                id: 1,
                date: new Date(),
                vendor: "Vendor 1",
                accountIndex: 1,
                description: "Test Transaction",
                amount: 99.99
            },
            {
                id: 2,
                date: new Date(),
                vendor: "Vendor 2",
                accountIndex: 0,
                description: "Test Transaction",
                amount: 99.99
            }
        ]);
    }, []);

    const addAccount = (newAccount: Account) => {
        setAccounts([newAccount].concat(accounts));
    };

    const addTransaction = (newTransaction: Transaction) => {
        setTransactions([newTransaction].concat(transactions));
    };

    const deleteTransaction = (transactionIndex: number) => {
        setTransactions(transactions.splice(transactionIndex, 1));
    };

    return (
        <div className="app">
            <div className="app__header">
                <h1 className="app__header__text">
                    Sage Financial Tracker
                </h1>
            </div>
            <div className="app__content">
                <div className="app__content__sidebar">
                    <Header text="Accounts" />
                    <AccountTable accounts={accounts} />
                    <AddAccountModal addAccountCallback={addAccount} />
                </div>
                <div className="app__content__main">
                    <Header text="Transactions" />
                    <TransactionTable accounts={accounts} transactions={transactions} deleteTransactionCallback={deleteTransaction} />
                    <AddTransactionModal accounts={accounts} addTransactionCallback={addTransaction} />
                </div>
            </div>
        </div>
    );
}
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Header } from '../components/base/header';
import { Transaction } from '../model/transaction';
import { Account } from '../model/account';
import { Sidebar } from '../components/sidebar';
import { client } from '../util/axios';
import { accountFromDynamoDB, entryFromDynamoDB, transactionFromDynamoDB } from '../util/parser';
import { Entry } from '../model/entry';

export const HomePage: FunctionComponent = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        client.get('/')
            .then((response) => {
                let accounts: Account[] = [];
                let transactions: Transaction[] = [];
                let entries: Entry[] = [];

                response.data.accounts.forEach((account: string) => {
                    accounts.push(accountFromDynamoDB(account));
                });

                response.data.transactions.forEach((transaction: string) => {
                    transactions.push(transactionFromDynamoDB(transaction));
                });

                response.data.entries.forEach((entry: string) => {
                    entries.push(entryFromDynamoDB(entry));
                });

                setAccounts(accounts);
                setTransactions(transactions);
                setEntries(entries);
            })
            .catch((error) => {
                console.log(error);
            })
    }, []);


    const addAccount = (newAccount: Account) => {
        setAccounts([newAccount].concat(accounts));
    };

    return (
        <div className="app">
            <div className="app__header">
                <h1 className="app__header__text">
                    Sage Financial Tracker
                </h1>
            </div>
            <div className="app__content">
                <Sidebar
                    accounts={accounts}
                    entries={entries}
                />
                <div className="app__content__main">
                    <Header text="Transactions" />
                </div>
            </div>
        </div>
    );
}

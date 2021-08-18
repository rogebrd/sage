import React, { FunctionComponent, useEffect, useState } from 'react';
import { AccountTable } from '../components/accountTable';
import { AddAccountModal } from '../components/addAccountModal';
import { Header } from '../components/base/header';
import { Transaction } from '../types/transaction';
import { Account, AccountCurrency, AccountType } from '../types/account';
import { Action } from '../types/action';
import { sampleAccounts, sampleTransactions, sampleActions } from '../sample';
import { ActionTable } from '../components/actionTable';

export const HomePage: FunctionComponent = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [actions, setActions] = useState<Action[]>([]);
    // Filter can be any object or function to filter on
    const [transactionFilter, setTransactionFilter] = useState<any>();
    // Sorter is of the format {field}{?-asending} where if the latter is omitted
    // it is assumed to be descending
    const [transactionSorter, setTransactionSorter] = useState<string>("");

    // useEffect(() => {
    //     let accountTotals = Array(accounts.length).fill(0);
    //     transactions.forEach((transaction) => {
    //         accountTotals[transaction.accountIndex] = accountTotals[transaction.accountIndex] + transaction.amount;
    //     });
    //     let newAccounts = Array(accounts.length).fill(null);
    //     accounts.forEach((account, index) => {
    //         newAccounts[index] = account;
    //         newAccounts[index].balance = accountTotals[index];
    //     });
    //     setAccounts(accounts);
    // }, [accounts, transactions]);

    useEffect(() => {
        setAccounts(sampleAccounts);
        setTransactions(sampleTransactions);
        setActions(sampleActions);
    }, []);

    const addAccount = (newAccount: Account) => {
        setAccounts([newAccount].concat(accounts));
    };

    const deleteAction = (actionIndex: number) => {
        setActions(actions.splice(actionIndex, 1));
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
                    <AccountTable accounts={accounts} selectAccountCallback={setTransactionFilter} />
                    <AddAccountModal addAccountCallback={addAccount} />
                </div>
                <div className="app__content__main">
                    <Header text="Transactions" />
                    <ActionTable
                        accounts={accounts}
                        actions={actions}
                        deleteActionCallback={deleteAction}
                        filter={transactionFilter}
                        sorter={transactionSorter}
                        setSorter={setTransactionSorter}
                    />
                </div>
            </div>
        </div>
    );
}

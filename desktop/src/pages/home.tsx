import React, { FunctionComponent, useEffect, useState } from 'react';
import { Header } from '../components/base/header';
import { Transaction } from '../types/transaction';
import { Account } from '../types/account';
import { Action } from '../types/action';
import { sampleAccounts, sampleTransactions, sampleActions, sampleOrganizations } from '../sample';
import { ActionTable } from '../components/actionTable';
import { Sidebar } from '../components/sidebar';
import { Organization } from '../types/organization';

export const HomePage: FunctionComponent = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [actions, setActions] = useState<Action[]>([]);
    // Filter can be any object or function to filter on
    const [transactionFilter, setTransactionFilter] = useState<any>();
    // Sorter is of the format {field}{?-asending} where if the latter is omitted
    // it is assumed to be descending
    const [transactionSorter, setTransactionSorter] = useState<string>("");

    useEffect(() => {
        setAccounts(sampleAccounts);
        setTransactions(sampleTransactions);
        setActions(sampleActions);
        setOrganizations(sampleOrganizations);
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
                <Sidebar
                    organizations={organizations}
                    setTransactionFilter={setTransactionFilter}
                    addAccount={addAccount}
                />
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

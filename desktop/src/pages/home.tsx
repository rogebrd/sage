import React, { FunctionComponent, useEffect, useState } from 'react';
import { Transaction } from '../model/transaction';
import { Account } from '../model/account';
import { Sidebar } from '../components/sidebar';
import { client } from '../util/axios';
import { accountFromDynamoDB, entryFromDynamoDB, transactionFromDynamoDB } from '../util/parser';
import { Entry } from '../model/entry';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { AddAccountModal } from '../components/addAccountModal';
import { Button } from '@material-ui/core';
import { NetWorthGraph } from '../components/netWorthGraph';
import { TransactionTable } from '../components/transactionTable';
import { AddTransactionModal } from '../components/addTransactionModal';
import { fetchStockPrices } from '../util/stockTracker';

export const HomePage: FunctionComponent = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [stockPrices, setStockPrices] = useState<{}>({});

    const [addAccountModalVisibility, setAddAccountModalVisibilty] = useState<boolean>(false);
    const [addTransactionModalVisibility, setAddTransactionModalVisibility] = useState<boolean>(false);

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

                response.data.entries.forEach((rawEntry: string) => {
                    entries.push(entryFromDynamoDB(rawEntry));
                });

                setStockPrices(fetchStockPrices(entries, stockPrices));
                setAccounts(accounts);
                setTransactions(transactions);
                setEntries(entries);
            })
            .catch((error) => {
                console.log(error);
            })
    }, []);

    return (
        <div className="app">
            <div className="app__header">
                <h1 className="app__header__text">
                    Sage
                </h1>
                <Button onClick={() => setAddAccountModalVisibilty(true)}>A<SettingsOutlinedIcon /></Button>
                <Button onClick={() => setAddTransactionModalVisibility(true)}>T<SettingsOutlinedIcon /></Button>
            </div>
            <div className="app__content">
                <Sidebar
                    accounts={accounts}
                    entries={entries}
                    stockPrices={stockPrices}
                />
                <div className="app__content__main">
                    <NetWorthGraph accounts={accounts} entries={entries} />
                    <TransactionTable
                        accounts={accounts}
                        entries={entries}
                        transactions={transactions}
                        updatedTransactionCallback={(transaction: Transaction) => { setTransactions(transactions.map((t) => t.id === transaction.id ? transaction : t)) }}
                        updatedEntryCallback={(updatedEntries: Entry[]) => {
                            setEntries(entries.map((entry) => {
                                const updated = updatedEntries.find((updatedEntry) => updatedEntry.id === entry.id);
                                return updated ? updated : entry;
                            }))
                        }}
                    />
                </div>
            </div>
            <AddAccountModal
                visible={addAccountModalVisibility}
                setVisible={setAddAccountModalVisibilty}
                accounts={accounts}
                newAccountCallback={(account: Account) => setAccounts(accounts.concat(account))}
            />
            <AddTransactionModal
                visible={addTransactionModalVisibility}
                setVisible={setAddTransactionModalVisibility}
                accounts={accounts}
                entries={entries}
                transactions={transactions}
                newTransactionCallback={(transaction: Transaction) => { transactions.length !== 0 ? setTransactions(transactions.concat(transaction)) : setTransactions([transaction]) }}
                newEntryCallback={(newEntries: Entry[]) => { entries.length !== 0 ? setEntries(entries.concat(newEntries)) : setEntries(newEntries) }}
            />
        </div>
    );
}

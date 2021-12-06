import React, { useState, FunctionComponent } from "react";
import { Account } from "../model/account";
import { Entry, StockAmount } from "../model/entry";
import { EntryStyle } from "../model/enums";
import { Transaction } from "../model/transaction";
import { formatDate, getAmountString, getStockAmountString } from "../util/helpers";
import { Card } from "./base/card";
import "../styles/transactionTable.scss";
import { Button } from "@material-ui/core";
import { AddTransactionModal } from "./addTransactionModal";
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';

type TransactionTableProps = {
    accounts: Account[],
    entries: Entry[],
    transactions: Transaction[],
    updatedEntryCallback: Function
    updatedTransactionCallback: Function,
}

export const TransactionTable: FunctionComponent<TransactionTableProps> = ({ accounts, transactions, entries, updatedTransactionCallback, updatedEntryCallback }) => {
    const [editTransactionModalVisibility, setEditTransactionModalVisibility] = useState(false);

    const renderAmount = (entry: Entry) => {
        if (typeof entry.amount === 'number') {
            return getAmountString(entry.getValue(new Date(entry.date)), entry.getAccount(accounts)?.type);
        } else {
            return getStockAmountString(entry.amount);
        }
    }

    const renderTransaction = (transaction: Transaction) => (
        <Card key={transaction.id}>
            <table className="transaction-table">
                <thead className="transaction-table--header">
                    <tr>
                        <td>{transaction.id}</td>
                        <td></td>
                        <td className="transaction-table--header-debit">debit</td>
                        <td className="transaction-table--header-credit">credit</td>
                        <td></td>
                        <td></td>
                        <td><Button onClick={() => setEditTransactionModalVisibility(true)}><SettingsOutlinedIcon /></Button></td>
                    </tr>
                </thead>
                <tbody className="transaction-table__body">
                    {
                        transaction.getEntries(entries).map((entry) => (
                            <tr key={entry.id} className="transaction-table__body__row">
                                <td className="transaction-table__body__row--account">{accounts.find((account) => account.id === entry.accountId)?.name}</td>
                                <td className="transaction-table__body__row--date">{formatDate(new Date(entry.date))}</td>
                                <td className="transaction-table__body__row--debit">{entry.style === EntryStyle.DEBIT ? renderAmount(entry) : ''}</td>
                                <td className="transaction-table__body__row--credit">{entry.style === EntryStyle.CREDIT ? renderAmount(entry) : ''}</td>
                                <td className="transaction-table__body__row--description">{entry.description}</td>
                                <td className="transaction-table__body__row--tags">{entry.tags}</td>
                                <td className="transaction-table__body__row--category">{entry.category ? entry.category : 'N/A'}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <AddTransactionModal
                visible={editTransactionModalVisibility}
                setVisible={setEditTransactionModalVisibility}
                accounts={accounts}
                entries={entries}
                transactions={transactions}
                newTransactionCallback={updatedTransactionCallback}
                newEntryCallback={updatedEntryCallback}
                existingTransaction={transaction}
            />
        </Card>
    );

    return (
        <>
            {
                transactions.map((transaction) => {
                    return renderTransaction(transaction);
                })
            }
        </>
    );
}


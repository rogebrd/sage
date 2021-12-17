import React, { FunctionComponent } from "react";
import { Account } from "../model/account";
import { Entry } from "../model/entry";
import { AccountType, EntryStyle } from "../model/enums";
import { Transaction } from "../model/transaction";
import { formatDate, getAmountString, getStockAmountString } from "../util/helpers";
import { Card } from "./base/card";
import "../styles/transactionTable.scss";
import { Button } from "./base/button";

type TransactionTableProps = {
    accounts: Account[],
    entries: Entry[],
    transactions: Transaction[],
    updatedEntryCallback: Function
    updatedTransactionCallback: Function,
}

export const TransactionTable: FunctionComponent<TransactionTableProps> = ({ accounts, transactions, entries, updatedTransactionCallback, updatedEntryCallback }) => {

    const renderAmount = (entry: Entry) => {
        if (typeof entry.amount === 'number') {
            return getAmountString(Math.abs(entry.getValue(new Date(entry.date))), entry.getAccount(accounts)?.type === AccountType.POINT);
        } else {
            return getStockAmountString(entry.amount);
        }
    }

    const renderTransaction = (transaction: Transaction) => (
        <Card>
            <table className="transaction-table">
                <tbody className="transaction-table__body" key={transaction.id}>
                    {
                        transaction.getEntries(entries).map((entry) => (
                            <tr key={entry.id} className="transaction-table__body__row" >
                                <td className="transaction-table__body__row--category">{entry.category ? (<span className="bubble">{entry.category}</span>) : null}</td>
                                <td className="transaction-table__body__row--account">{accounts.find((account) => account.id === entry.accountId)?.name}</td>
                                <td className="transaction-table__body__row--date">{formatDate(new Date(entry.date))}</td>
                                <td className="transaction-table__body__row--debit">{entry.style === EntryStyle.DEBIT ? renderAmount(entry) : ''}</td>
                                <td className="transaction-table__body__row--credit">{entry.style === EntryStyle.CREDIT ? `(${renderAmount(entry)})` : ''}</td>
                                <td className="transaction-table__body__row--description">{entry.description}</td>
                                <td className="transaction-table__body__row--tags">{entry.tags}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </Card >
    );

    return (
        <>
            <div className="control">
                <span className="control__filter">filter</span>
                <span className="control__expand">expand</span>
                <span className="control__add"><Button text="add transaction" /></span>
            </div>
            <table className="transaction-table">
                <thead className="transaction-table--header">
                    <tr>
                        <td className="transaction-table--header-category">category</td>
                        <td className="transaction-table--header-account">account</td>
                        <td className="transaction-table--header-date">date</td>
                        <td className="transaction-table--header-debit">debit</td>
                        <td className="transaction-table--header-credit">credit</td>
                        <td className="transaction-table--header-description">description</td>
                        <td className="transaction-table--header-tags">tags</td>
                    </tr>
                </thead>
            </table>
            {
                transactions.map((transaction) => {
                    return renderTransaction(transaction);
                })
            }
        </>
    );
}


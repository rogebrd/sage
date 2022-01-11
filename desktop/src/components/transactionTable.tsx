import React, { FunctionComponent, useEffect, useState } from "react";
import { Account } from "../model/account";
import { AccountType, EntryStyle } from "../model/enums";
import { formatDate, getAmountString, getStockAmountString } from "../util/helpers";
import { Card } from "./base/card";
import "../styles/transactionTable.scss";
import { Button } from "./base/button";
import { Entry, Transaction } from "../types";
import { useSageContext } from "../data/provider";

type TransactionTableProps = {
}

export const TransactionTable: FunctionComponent<TransactionTableProps> = () => {
    const { resourceManager, state } = useSageContext();

    useEffect(() => {
        resourceManager.transactionTable();
    }, []);

    const renderAmount = (entry: Entry) => {
        if (typeof entry.amount === 'number') {
            return getAmountString(entry.amount, false);
        } else {
            return getStockAmountString(entry.amount);
        }
    }

    const renderTransaction = (transaction: Transaction) => (
        <Card>
            <table className="transaction-table">
                <tbody className="transaction-table__body" key={transaction.id}>
                    {
                        transaction.entries.map((entry) => (
                            <tr key={entry.id} className="transaction-table__body__row" >
                                <td className="transaction-table__body__row--category">{entry.category ? (<span className="bubble">{entry.category}</span>) : null}</td>
                                <td className="transaction-table__body__row--account">{state.accounts.find((account) => account.id === entry.accountId)?.name}</td>
                                <td className="transaction-table__body__row--date">{formatDate(entry.date)}</td>
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
                state.transactions.map((transaction) => {
                    return renderTransaction(transaction);
                })
            }
        </>
    );
}


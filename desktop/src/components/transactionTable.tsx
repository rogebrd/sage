import React, { FunctionComponent } from "react";
import { Account } from "../types/account";
import { Transaction } from "../types/transaction";
import "../styles/transactionTable.scss";
import { Button } from "./base/button";
import { formatDate } from "../util/util";

type TransactionTableProps = {
    accounts: Account[],
    transactions: Transaction[],
    deleteTransactionCallback: Function,
    filter: any,
    sorter: string,
    setSorter: Function,
}

export const TransactionTable: FunctionComponent<TransactionTableProps> = ({ accounts, transactions, deleteTransactionCallback, filter, sorter, setSorter }) => {

    const filterTransactions = (transaction: Transaction) => {
        if (!filter) {
            return true;
        }
        if (true) {
            return accounts[transaction.accountIndex].id === filter.id
        }
    }

    const updateSorter = (criteria: string) => {
        if (sorter.startsWith(criteria)) {
            if (sorter.endsWith("-ascending")) {
                setSorter(criteria);
            } else {
                setSorter(criteria + "-ascending")
            }
        } else {
            setSorter(criteria);
        }
    }

    const sortTransactions = (transaction_one: Transaction, transaction_two: Transaction) => {
        let value_one: any = transaction_one.id;
        let value_two: any = transaction_two.id;
        let direction: string = 'descending';

        if (sorter.endsWith('-ascending')) {
            direction = 'ascending';
        }

        if (sorter.startsWith("date")) {
            value_one = transaction_one.date;
            value_two = transaction_two.date;
        }

        if (sorter.startsWith("account")) {
            value_one = transaction_one.accountIndex;
            value_two = transaction_two.accountIndex;
        }

        if (sorter.startsWith("vendor")) {
            value_one = transaction_one.vendor;
            value_two = transaction_two.vendor;
        }

        if (sorter.startsWith("amount")) {
            value_one = transaction_one.amount;
            value_two = transaction_two.amount;
        }

        if (sorter.startsWith("category")) {
            value_one = transaction_one.category || "";
            value_two = transaction_two.category || "";
        }

        if (value_one === value_two) {
            return 0;
        }
        if ((direction === 'ascending' && value_one > value_two) || (direction === 'descending' && value_one < value_two)) {
            return 1;
        } else {
            return -1;
        }
    }

    return (
        <table className="transaction-table">
            <thead>
                <tr className="transaction-table__header">
                    <th className="transaction-table__header--id">Id <span onClick={() => updateSorter("id")} >^</span></th>
                    <th className="transaction-table__header--date">Date <span onClick={() => updateSorter("date")} >^</span></th>
                    <th className="transaction-table__header--account">Account <span onClick={() => updateSorter("account")} >^</span></th>
                    <th className="transaction-table__header--vendor">Vendor <span onClick={() => updateSorter("vendor")} >^</span></th>
                    <th className="transaction-table__header--amount">Amount <span onClick={() => updateSorter("amount")} >^</span></th>
                    <th className="transaction-table__header--category">Category <span onClick={() => updateSorter("category")} >^</span></th>
                    <th className="transaction-table__header--options"></th>
                </tr>
            </thead>
            <tbody>
                {
                    transactions.filter(filterTransactions).sort(sortTransactions).map((transaction, index) => (
                        <tr key={index} className="transaction-table__row">
                            <td className="transaction-table__row--id">
                                {transaction.id}
                            </td>
                            <td className="transaction-table__row--date">
                                {formatDate(transaction.date)}
                            </td>
                            <td className="transaction-table__row--account">
                                {accounts[transaction.accountIndex].name}
                            </td>
                            <td className="transaction-table__row--vendor">
                                {transaction.vendor}
                            </td>
                            <td className="transaction-table__row--amount">
                                ${transaction.amount}
                            </td>
                            <td className="transaction-table__row--category">
                                {transaction.category}
                            </td>
                            <td className="transaction-table__row--options">
                                <Button text="X" onClick={() => deleteTransactionCallback(index)} />
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
}
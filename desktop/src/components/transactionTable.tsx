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
}

export const TransactionTable: FunctionComponent<TransactionTableProps> = ({ accounts, transactions, deleteTransactionCallback, filter }) => {

    const filterTransactions = (transaction: Transaction) => {
        if (!filter) {
            return true;
        }
        if (true) {
            return accounts[transaction.accountIndex].id === filter.id
        }
    }

    return (
        <table className="transaction-table">
            <thead>
                <tr className="transaction-table__header">
                    <th className="transaction-table__header--id">Id</th>
                    <th className="transaction-table__header--date">Date</th>
                    <th className="transaction-table__header--account">Account</th>
                    <th className="transaction-table__header--vendor">Vendor</th>
                    <th className="transaction-table__header--description">Description</th>
                    <th className="transaction-table__header--amount">Amount</th>
                    <th className="transaction-table__header--category">Category</th>
                    <th className="transaction-table__header--options"></th>
                </tr>
            </thead>
            <tbody>
                {
                    transactions.filter(filterTransactions).map((transaction, index) => (
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
                            <td className="transaction-table__row--description">
                                {transaction.description}
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
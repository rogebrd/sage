import React, { FunctionComponent } from "react";
import { Account } from "../types/account";
import { Transaction } from "../types/transaction";
import "../styles/transactionTable.scss";
import { Button } from "./base/button";

type TransactionTableProps = {
    accounts: Account[],
    transactions: Transaction[],
    deleteTransactionCallback: Function
}

export const TransactionTable: FunctionComponent<TransactionTableProps> = ({ accounts, transactions, deleteTransactionCallback }) => {
    return (
        <table className="transaction-table">
            <thead>
                <tr className="transaction-table__header">
                    <th className="transaction-table__header--id">Id</th>
                    <th className="transaction-table__header--date">Date</th>
                    <th className="transaction-table__header--vendor">Vendor</th>
                    <th className="transaction-table__header--account">Account</th>
                    <th className="transaction-table__header--description">Description</th>
                    <th className="transaction-table__header--amount">Amount</th>
                    <th className="transaction-table__header--delete"></th>
                </tr>
            </thead>
            <tbody>
                {
                    transactions.map((transaction, index) => (
                        <tr key={index} className="transaction-table__row">
                            <td className="transaction-table__row--id">
                                {transaction.id}
                            </td>
                            <td className="transaction-table__row--date">
                                {transaction.date.toISOString()}
                            </td>
                            <td className="transaction-table__row--vendor">
                                {transaction.vendor}
                            </td>
                            <td className="transaction-table__row--account">
                                {accounts[transaction.accountIndex].name}
                            </td>
                            <td className="transaction-table__row--description">
                                {transaction.description}
                            </td>
                            <td className="transaction-table__row--amount">
                                ${transaction.amount}
                            </td>
                            <td className="transaction-table__row--delete">
                                <Button text="X" onClick={() => deleteTransactionCallback(index)} />
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
}
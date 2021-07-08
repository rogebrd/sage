import React, { FunctionComponent } from "react";
import { Transaction } from "../types/transaction";
import "../styles/transactionTable.scss";

type TransactionTableProps = {
    transactions: Transaction[]
}

export const TransactionTable: FunctionComponent<TransactionTableProps> = ({ transactions }) => {
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
                    transactions.map((transaction) => (
                        <tr className="transaction-table__row">
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
                                {transaction.account.name}
                            </td>
                            <td className="transaction-table__row--description">
                                {transaction.description}
                            </td>
                            <td className="transaction-table__row--amount">
                                ${transaction.amount}
                            </td>
                            <td className="transaction-table__row--delete">
                                X
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
}
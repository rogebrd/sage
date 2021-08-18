import React, { FunctionComponent } from "react";
import { Account } from "../types/account";
import "../styles/transactionTable.scss";
import { Button } from "./base/button";
import { formatDate } from "../util/util";
import { Action, ActionStyle } from "../types/action";

type ActionTableProps = {
    accounts: Account[],
    actions: Action[],
    deleteActionCallback: Function,
    filter: any,
    sorter: string,
    setSorter: Function,
}

export const ActionTable: FunctionComponent<ActionTableProps> = ({ accounts, actions, deleteActionCallback, filter, sorter, setSorter }) => {

    const filterActions = (action: Action) => {
        if (!filter) {
            return true;
        }
        if (true) {
            return action.accountId === filter;
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

    const sortActions = (action_one: Action, action_two: Action) => {
        let value_one: any = action_one.id;
        let value_two: any = action_two.id;
        let direction: string = 'descending';

        if (sorter.endsWith('-ascending')) {
            direction = 'ascending';
        }

        if (sorter.startsWith("date")) {
            value_one = action_one.date;
            value_two = action_two.date;
        }

        if (sorter.startsWith("account")) {
            value_one = action_one.accountId;
            value_two = action_two.accountId;
        }

        if (sorter.startsWith("amount")) {
            value_one = action_one.amount;
            value_two = action_two.amount;
        }

        if (sorter.startsWith("category")) {
            value_one = action_one.category || "";
            value_two = action_two.category || "";
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
                    <th className="transaction-table__header--transaction">Transaction <span onClick={() => updateSorter("transaction")} >^</span></th>
                    <th className="transaction-table__header--date">Date <span onClick={() => updateSorter("date")} >^</span></th>
                    <th className="transaction-table__header--account">Account <span onClick={() => updateSorter("account")} >^</span></th>
                    <th className="transaction-table__header--amount-debit">Debit Amount <span onClick={() => updateSorter("debitAmount")} >^</span></th>
                    <th className="transaction-table__header--amount-credit">Credit Amount <span onClick={() => updateSorter("creditAmount")} >^</span></th>
                    <th className="transaction-table__header--category">Category <span onClick={() => updateSorter("category")} >^</span></th>
                    <th className="transaction-table__header--tag">Tag <span onClick={() => updateSorter("tag")} >^</span></th>
                    <th className="transaction-table__header--options"></th>
                </tr>
            </thead>
            <tbody>
                {
                    actions.filter(filterActions).sort(sortActions).map((action, index) => {
                        return (
                            <tr key={index} className="transaction-table__row">
                                <td className="transaction-table__row--id">
                                    {action.id}
                                </td>
                                <td className="transaction-table__row--transaction">
                                    {action.transactionId}
                                </td>
                                <td className="transaction-table__row--date">
                                    {formatDate(action.date)}
                                </td>
                                <td className="transaction-table__row--account">
                                    {action.accountId}
                                </td>
                                <td className="transaction-table__row--amount-debit">
                                    ${action.style === ActionStyle.DEBIT ? action.amount : 0.0}
                                </td>
                                <td className="transaction-table__row--amount-credit">
                                    ${action.style === ActionStyle.CREDIT ? action.amount : ''}
                                </td>
                                <td className="transaction-table__row--category">
                                    {action.category}
                                </td>
                                <td className="transaction-table__row--tag">
                                    {action.tag}
                                </td>
                                <td className="transaction-table__row--options">
                                    <Button text="X" onClick={() => deleteActionCallback(index)} />
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    );
}
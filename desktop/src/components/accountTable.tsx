import React, { FunctionComponent } from "react";
import { Account, AccountType } from "../types/account";
import "../styles/accountTable.scss";

type AccountTableProps = {
    accounts: Account[]
}

export const AccountTable: FunctionComponent<AccountTableProps> = ({ accounts }) => {
    return (
        <div className="account-table">

            <div className="account-table__subheader">
                Cash
            </div>
            <table>
                {
                    accounts.filter((account) => (account.type == AccountType.Cash)).map((account) => (
                        <AccountTableRow account={account} />
                    ))
                }
            </table>
            <div className="account-table__subheader">
                Investment
            </div>
            <table>
                {
                    accounts.filter((account) => (account.type == AccountType.Investment)).map((account) => (
                        <AccountTableRow account={account} />
                    ))
                }
            </table>
            <div className="account-table__subheader">
                Liability
            </div>
            <table>
                {
                    accounts.filter((account) => (account.type == AccountType.Liability)).map((account) => (
                        <AccountTableRow account={account} />
                    ))
                }
            </table>
        </div>
    );
}

type AccountTableRowProps = {
    account: Account
}

export const AccountTableRow: FunctionComponent<AccountTableRowProps> = ({ account }) => {
    return (
        <tr className="account-table__row">
            <td className="account-table__row--id">
                {account.id}
            </td>
            <td className="account-table__row--name">
                {account.name}
            </td>
            <td className="account-table__row--balance">
                ${account.balance}
            </td>
        </tr>
    )
}

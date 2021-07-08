import React, { FunctionComponent } from "react";
import { Account } from "../types/account";
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
                <tbody>
                    {
                        accounts.filter((account) => (account.type == 'Cash')).map((account) => (
                            <AccountTableRow account={account} />
                        ))
                    }
                </tbody>
            </table>
            <div className="account-table__subheader">
                Investment
            </div>
            <table>
                <tbody>
                    {
                        accounts.filter((account) => (account.type == 'Investment')).map((account) => (
                            <AccountTableRow account={account} />
                        ))
                    }
                </tbody>
            </table>
            <div className="account-table__subheader">
                Liability
            </div>
            <table>
                <tbody>
                    {
                        accounts.filter((account) => (account.type == 'Liability')).map((account) => (
                            <AccountTableRow account={account} />
                        ))
                    }
                </tbody>
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

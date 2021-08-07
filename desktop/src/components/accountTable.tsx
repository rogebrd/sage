import React, { FunctionComponent } from "react";
import { Account } from "../types/account";
import "../styles/accountTable.scss";

type AccountTableProps = {
    accounts: Account[],
    selectAccountCallback: Function
}

export const AccountTable: FunctionComponent<AccountTableProps> = ({ accounts, selectAccountCallback }) => {

    const sortAccounts = (account_one: Account, account_two: Account) => {
        return account_two.balance - account_one.balance;
    }
    return (
        <div className="account-table">

            <div className="account-table__subheader">
                Cash
            </div>
            <table>
                <tbody>
                    {
                        accounts.filter((account) => (account.type === 'Cash')).sort(sortAccounts).map((account, index) => (
                            <AccountTableRow key={index} account={account} selectAccountCallback={selectAccountCallback} />
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
                        accounts.filter((account) => (account.type === 'Investment')).sort(sortAccounts).map((account, index) => (
                            <AccountTableRow key={index} account={account} selectAccountCallback={selectAccountCallback} />
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
                        accounts.filter((account) => (account.type === 'Liability')).sort(sortAccounts).map((account, index) => (
                            <AccountTableRow key={index} account={account} selectAccountCallback={selectAccountCallback} />
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}

type AccountTableRowProps = {
    account: Account,
    selectAccountCallback: Function
}

export const AccountTableRow: FunctionComponent<AccountTableRowProps> = ({ account, selectAccountCallback }) => {
    return (
        <tr className="account-table__row" onClick={() => selectAccountCallback(account)}>
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

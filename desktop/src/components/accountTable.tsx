import React, { FunctionComponent } from "react";
import { Account, AccountType } from "../types/account";
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
            {
                [AccountType.CASH,
                AccountType.INVESTMENT,
                AccountType.LIABILITY,
                AccountType.ALLOWANCE,
                AccountType.TAX,
                AccountType.PHYSICAL].map((type) => {
                    return (
                        <>
                            <div className="account-table__subheader">
                                {type}
                            </div>
                            <table>
                                <tbody>
                                    {
                                        accounts.filter((account) => (account.type === type)).sort(sortAccounts).map((account, index) => (
                                            <AccountTableRow key={index} account={account} selectAccountCallback={selectAccountCallback} />
                                        ))
                                    }
                                </tbody>
                            </table>
                        </>)
                })
            }
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

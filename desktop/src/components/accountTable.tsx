import React, { FunctionComponent } from "react";
import { Account } from "../types/account";
import "../styles/accountTable.scss";
import { Organization } from "../types/organization";
import { formatAccountBalance, formatHeaderBalance } from "../util/util";

type AccountTableProps = {
    organizations: Organization[],
    selectAccountCallback: Function
}

export const AccountTable: FunctionComponent<AccountTableProps> = ({ organizations, selectAccountCallback }) => {
    const [balance, setBalance] = React.useState(0);

    const renderAccount = (account: Account, depth: number) => (
        <>
            <div className="account-table__organization__account">
                <span className={`account-table__organization__account--title-${depth}`}>{account.name}</span>
                <span className="account-table__organization__account--balance">
                    {formatAccountBalance(account)}
                </span>
            </div>
            <span>
                {

                    account.childAccounts?.map((child) => {
                        return renderAccount(child, depth + 1)
                    })
                }
            </span>
        </>
    )

    React.useEffect(() => {
        setBalance(organizations
            .flatMap((organization) => organization.accounts)
            .map((account) => account.balance)
            .reduce((sum, currentBalance) => sum + currentBalance, 0))
    }, [organizations]);

    return (
        <div className="account-table">
            {
                organizations.map((organization) => {
                    const organizationBalance = organization.accounts.map((account) => account.balance).reduce((sum, currentBalance) => sum + currentBalance, 0);
                    return (
                        <div className="account-table__organization">
                            <div className="account-table__organization__header">
                                <span className="account-table__organization__header--title">{organization.name}</span>
                                <span className="account-table__organization__header--balance">
                                    <span className={organizationBalance >= 0 ? "positive" : "negative"}>
                                        {formatHeaderBalance(organizationBalance)}
                                    </span>
                                </span>
                            </div>
                            {
                                organization.accounts.map((account) => {
                                    return (renderAccount(account, 0))
                                })
                            }
                        </div>
                    )
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

import React, { FunctionComponent } from "react"
import { Organization } from "../types/organization";
import "../styles/accountSummary.scss";
import { AccountType } from "../types/account";
import { formatHeaderBalance } from "../util/util";

interface AccountSummaryProps {
    organizations: Organization[]
}

export const AccountSummary: FunctionComponent<AccountSummaryProps> = ({ organizations }) => {
    const getTypeSummary = (type: AccountType) => {
        const balance = organizations
            .flatMap((organization) => organization.accounts)
            .filter((account) => account.type === type)
            .map((account) => account.balance)
            .reduce((sum, balance) => sum + balance, 0);
        return (
            <div className="account-summary__type">
                <h2 className="account-summary__type--title">
                    {AccountType[type]}
                </h2>
                <span className="account-summary__type--balance">
                    <span className={balance >= 0 ? "positive" : "negative"}>
                        {formatHeaderBalance(balance)}
                    </span>
                </span>
            </div >
        )
    }

    const balance = organizations
        .flatMap((organization) => organization.accounts)
        .map((account) => account.balance)
        .reduce((sum, balance) => sum + balance, 0);

    return (
        <div className="account-summary">
            <div className="account-summary--worth">Net Worth:</div>
            <div className="account-summary--amount">{formatHeaderBalance(balance)}</div>
            {
                [AccountType.CASH, AccountType.INVESTMENT, AccountType.LIABILITY]
                    .map((type) => {
                        return getTypeSummary(type);
                    })
            }
        </div>
    )
}
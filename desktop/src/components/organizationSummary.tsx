import React, { FunctionComponent } from "react"
import { Organization } from "../types/organization"
import { Account, AccountType } from "../types/account"
import { formatBalance, renderAccountTypeIcon } from "../util/util"
import { ExpandMore, ExpandLess } from "@material-ui/icons"

type OrganizationSummaryProps = {
    organization: Organization,
}

export const OrganizationSummary: FunctionComponent<OrganizationSummaryProps> = ({ organization }) => {
    const [balance, setBalance] = React.useState(0);
    const [showAccounts, setShowAccounts] = React.useState(true);

    React.useEffect(() => {
        setBalance(organization.getBalance()[organization.primaryType])
    }, [organization]);

    const renderAccount = (account: Account, depth: number) => (
        <>
            <div className="account-table__organization__account">
                <span className={`account-table__organization__account--title-${depth}`}>
                    {account.name}
                    <span className="account-table__organization__account--title-icon">
                        {renderAccountTypeIcon(account.type)}
                    </span>
                </span>
                <span className="account-table__organization__account--balance">
                    {formatBalance(account.getBalance()[account.type], account.type)}
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

    return (
        <div className="account-table__organization">
            <div className="account-table__organization__header">
                <span className="account-table__organization__header--title">
                    {!showAccounts && (<ExpandMore onClick={() => { setShowAccounts(true) }} />)}
                    {showAccounts && (<ExpandLess onClick={() => { setShowAccounts(false) }} />)}
                    {organization.name}
                </span>
                <span className="account-table__organization__header--balance">
                    <span className={balance >= 0 ? "positive" : "negative"}>
                        {formatBalance(balance, organization.primaryType)}
                    </span>
                </span>
            </div>
            {
                showAccounts && (
                    organization.accounts.map((account) => {
                        return (renderAccount(account, 0))
                    })
                )
            }
        </div>
    )
}
import React, { FunctionComponent } from "react"
import { Organization } from "../types/organization";
import "../styles/portfolioSummary.scss";
import { AccountType } from "../types/account";
import { formatBalance, renderAccountTypeIcon } from "../util/util";

interface PortfolioSummaryProps {
    organizations: Organization[]
}

export const PortfolioSummary: FunctionComponent<PortfolioSummaryProps> = ({ organizations }) => {
    const [aggregateBalanceByType, setAggregateBalanceByType] = React.useState<{ [key: number]: number }>({})
    const [aggregateBalance, setAggregateBalance] = React.useState(0);

    const getTypeSummary = (type: AccountType) => {
        let typeBalance = aggregateBalanceByType[type];
        if (!typeBalance) {
            return;
        }
        return (
            <div className="account-summary__type">
                <h2 className="account-summary__type--title">
                    {renderAccountTypeIcon(type)}
                    {AccountType[type]}
                </h2>
                <span className="account-summary__type--balance">
                    <span className={typeBalance >= 0 ? "positive" : "negative"}>
                        {formatBalance(typeBalance, type)}
                    </span>
                </span>
            </div >
        )
    }

    React.useEffect(() => {
        let aggregate = 0;
        let totalBalance: { [key: number]: number } = {};
        for (let organization of organizations) {
            let childBalance = organization.getBalance();
            for (let [type, balance] of Object.entries(childBalance)) {
                let newBalance = 0;
                if (totalBalance[Number.parseInt(type)]) {
                    newBalance += totalBalance[Number.parseInt(type)];
                }
                newBalance += balance;
                totalBalance[Number.parseInt(type)] = newBalance;
                if (Number.parseInt(type) !== AccountType.POINT) {
                    aggregate += balance;
                }
            }
        }

        setAggregateBalanceByType(totalBalance);
        setAggregateBalance(aggregate);
    }, [organizations]);

    return (
        <div className="account-summary">
            <div className="account-summary--worth">Net Worth:</div>
            <div className="account-summary--amount">
                {formatBalance(aggregateBalance, AccountType.CASH)}
            </div>
            {
                [AccountType.CASH, AccountType.INVESTMENT, AccountType.LIABILITY, AccountType.POINT]
                    .map((type) => {
                        return getTypeSummary(type);
                    })
            }
        </div>
    )
}
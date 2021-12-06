import React, { FunctionComponent, useEffect, useState } from "react"
import { Account } from "../model/account";
import { Entry } from "../model/entry";
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import LoyaltyOutlinedIcon from '@material-ui/icons/LoyaltyOutlined';
import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined'
import CreditCardOutlinedIcon from '@material-ui/icons/CreditCardOutlined';
import PollOutlinedIcon from '@material-ui/icons/PollOutlined';
import HouseOutlinedIcon from '@material-ui/icons/HouseOutlined';
import LocalAtmOutlinedIcon from '@material-ui/icons/LocalAtmOutlined';
import SubdirectoryArrowRightOutlinedIcon from '@material-ui/icons/SubdirectoryArrowRightOutlined';
import { AccountCategory, AccountType } from "../model/enums";
import { Star } from "@material-ui/icons";
import "../styles/sidebar.scss";
import { getAmountString, prettifyEnum } from "../util/helpers";
import { Card } from "./base/card";
import NetworkCheckIcon from '@material-ui/icons/NetworkCheck';

interface SidebarProps {
    accounts: Account[],
    entries: Entry[],
    stockPrices: any,
}

export const Sidebar: FunctionComponent<SidebarProps> = ({ accounts, entries, stockPrices }) => {
    const [netWorth, setNetWorth] = useState<number>(0);
    const currentDate = new Date();

    const getCategories = (accounts: Account[]) => accounts
        .map((account) => account.category)
        .filter((item, i, ar) => ar.indexOf(item) === i);

    const getIconForCategory = (category: AccountCategory) => {
        if (category === AccountCategory.DAILY) {
            return (<LocalAtmOutlinedIcon className="daily" />)
        }
        if (category === AccountCategory.SPECIAL) {
            return (<Star className="special" />)
        }
        if (category === AccountCategory.SAVINGS) {
            return (<HouseOutlinedIcon className="savings" />)
        }
        if (category === AccountCategory.RETIREMENT) {
            return (<AccountBalanceOutlinedIcon className="retirement" />)
        }
    }

    const pointIcon = (<LoyaltyOutlinedIcon className="point" />);
    const childAccountIcon = (<SubdirectoryArrowRightOutlinedIcon className="childAccount" />);

    const getIconForType = (type: AccountType) => {
        if (type === AccountType.CASH) {
            return (<MonetizationOnOutlinedIcon className="cash" />)
        }
        if (type === AccountType.LIABILITY) {
            return (<CreditCardOutlinedIcon className="liability" />)
        }
        if (type === AccountType.INVESTMENT) {
            return (<PollOutlinedIcon className="investment" />)
        }
        if (type === AccountType.POINT) {
            return (<Star className="point" />)
        }
    }

    const renderAccount = (account: Account, isChildAccount: boolean = false) => (
        <div key={account.id} className="sidebar__accounts--account">
            <p>
                {
                    isChildAccount ? childAccountIcon : null
                }
                {account.name}
            </p>
            <p>
                {getAmountString(account.getValue(entries, currentDate, stockPrices), account.type)}
                {
                    account.maxValue ? (
                        <span className="subtext">
                            rem.
                        </span>
                    ) : null
                }
                {
                    account.type === AccountType.POINT ? pointIcon : null
                }
            </p>
        </div>
    );

    const sortAccounts = (a: Account, b: Account) => {
        if (a.maxValue && !b.maxValue) {
            return 1;
        }
        if (!a.maxValue && b.maxValue) {
            return -1;
        }

        return Math.abs(b.getValue(entries, currentDate, stockPrices)) - Math.abs(a.getValue(entries, currentDate, stockPrices));
    }

    useEffect(() => {
        setNetWorth(
            accounts.filter((account) => account.type !== AccountType.POINT).map((account) => account.getValue(entries, currentDate, stockPrices)).reduce((total: number, current: number) => total + current, 0)
        );
    }, [accounts, entries, stockPrices]);

    return (
        <div className="sidebar" >
            <Card>
                <span className="sidebar__total">
                    <h1>${Math.floor(netWorth).toLocaleString('en-US')}</h1>
                    <h2>.{
                        Math.round((netWorth - Math.floor(netWorth)) * 100).toLocaleString('en-US')
                    }
                    </h2>
                    {Object.keys(stockPrices).length === 0 ? (<NetworkCheckIcon />) : null}
                </span>
            </Card>
            <Card>
                {
                    getCategories(accounts).sort().map((category) => {
                        const categoryValue = accounts
                            .filter((account) => account.category === category)
                            .map((account) => account.getValue(entries, currentDate, stockPrices))
                            .reduce((total: number, current: number) => total + current, 0);
                        return (
                            <div key={category} className="sidebar__category">
                                <h2>
                                    {getIconForCategory(category)}
                                    {prettifyEnum(AccountCategory[category])}
                                </h2>
                                <h2>{
                                    categoryValue < 0 ? (
                                        <span className="negative">
                                            {
                                                getAmountString(
                                                    categoryValue,
                                                    (category === AccountCategory.SPECIAL) ? AccountType.POINT : AccountType.CASH
                                                )
                                            }
                                            {
                                                category === AccountCategory.SPECIAL ? pointIcon : null
                                            }
                                        </span>
                                    ) :
                                        (
                                            <>
                                                {
                                                    getAmountString(
                                                        categoryValue,
                                                        (category === AccountCategory.SPECIAL) ? AccountType.POINT : AccountType.CASH
                                                    )
                                                }
                                                {
                                                    category === AccountCategory.SPECIAL ? pointIcon : null
                                                }
                                            </>
                                        )
                                }</h2>
                            </div>
                        )
                    })
                }
            </Card>
            {
                [AccountType.CASH, AccountType.INVESTMENT, AccountType.LIABILITY].map((type) => {
                    const typeAccounts = accounts.filter((account) => account.type === type).filter((account) => !account.parentAccountId).sort(sortAccounts);
                    const typeValue = typeAccounts
                        .map((account) => account.getValue(entries, currentDate, stockPrices))
                        .reduce((total: number, current: number) => total + current, 0);
                    return (
                        <Card key={type}>
                            <div className="sidebar__type">
                                <h2>
                                    {getIconForType(type)}
                                    {prettifyEnum(AccountType[type])}
                                </h2>
                                <h2>
                                    {
                                        typeValue < 0 ? (
                                            <span className="negative">
                                                {getAmountString(typeValue, AccountType.CASH)}
                                            </span>
                                        ) :
                                            getAmountString(typeValue, AccountType.CASH)
                                    }
                                </h2>
                            </div>
                            <div className="sidebar__accounts">
                                {
                                    typeAccounts.map((account) => (
                                        <>
                                            {
                                                renderAccount(account)
                                            }
                                            {
                                                account.getChildAccounts(accounts).length > 0 ? account.getChildAccounts(accounts)
                                                    .sort(sortAccounts)
                                                    .map((childAccount) => {
                                                        return renderAccount(childAccount, true);
                                                    }) : null
                                            }
                                        </>
                                    ))
                                }
                            </div>
                        </Card>
                    )
                })
            }
        </div>
    )
}
import React, { FunctionComponent, useEffect, useState } from "react"
import { Account } from "../model/account";
import { Entry } from "../model/entry";
import { Container } from "@material-ui/core";
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

interface SidebarProps {
    accounts: Account[],
    entries: Entry[]
}

export const Sidebar: FunctionComponent<SidebarProps> = ({ accounts, entries }) => {
    const [netWorth, setNetWorth] = useState<number>(0);

    const getAmountString = (amount: number, type: AccountType) => {
        return `
        ${amount < 0 ? '-' : ''}${type !== AccountType.POINT ? '$' : ''}${type !== AccountType.POINT ?
                Math.abs(amount).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }) :
                amount.toLocaleString('en-US', { maximumFractionDigits: 0 })
            }
        `
    }

    const fixString = (string: string) => {
        let s = string.toLowerCase();
        return s[0].toUpperCase() + s.slice(1)
    }

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
        <div className="sidebar__accounts--account">
            <p>
                {
                    isChildAccount ? childAccountIcon : null
                }
                {account.name}
            </p>
            <p>
                {getAmountString(account.getValue(entries), account.type)}
                {
                    account.maxValue ? (`/ ${getAmountString(account.maxValue, account.type)}`) : null
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

        return a.name > b.name ? 1 : -1;
    }

    useEffect(() => {
        setNetWorth(
            accounts.map((account) => account.getValue(entries)).reduce((total: number, current: number) => total + current, 0)
        );
    }, [accounts, entries]);

    return (
        <div className="sidebar" >
            <Container className="sidebar__container">
                <div className="sidebar__container--holder">
                    <span className="sidebar__total">
                        <h1>${Math.floor(netWorth).toLocaleString('en-US')}</h1>
                        <h2>.{
                            Math.round((netWorth - Math.floor(netWorth)) * 100).toLocaleString('en-US')
                        }
                        </h2>
                    </span>
                </div>
            </Container>
            <Container className="sidebar__container">
                <div className="sidebar__container--holder">
                    {
                        getCategories(accounts).sort().map((category) => {
                            const categoryValue = accounts.
                                filter((account) => account.category === category)
                                .map((account) => account.getValue(entries))
                                .reduce((total: number, current: number) => total + current, 0);
                            return (
                                <div className="sidebar__category">
                                    <h2>
                                        {getIconForCategory(category)}
                                        {fixString(AccountCategory[category])}
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
                </div>
            </Container>
            {
                [AccountType.CASH, AccountType.INVESTMENT, AccountType.LIABILITY].map((type) => {
                    const typeAccounts = accounts.filter((account) => account.type === type).filter((account) => !account.parentAccountId).sort(sortAccounts);
                    const typeValue = typeAccounts
                        .map((account) => account.getValue(entries))
                        .reduce((total: number, current: number) => total + current, 0);
                    return (
                        <Container className="sidebar__container">
                            <div className="sidebar__container--holder">
                                <div className="sidebar__type">
                                    <h2>
                                        {getIconForType(type)}
                                        {fixString(AccountType[type])}
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
                            </div>
                        </Container>
                    )
                })
            }
        </div>
    )
}
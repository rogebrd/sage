import React, { FunctionComponent, useState, useEffect } from 'react';
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import LoyaltyOutlinedIcon from '@material-ui/icons/LoyaltyOutlined';
import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined';
import CreditCardOutlinedIcon from '@material-ui/icons/CreditCardOutlined';
import PollOutlinedIcon from '@material-ui/icons/PollOutlined';
import HouseOutlinedIcon from '@material-ui/icons/HouseOutlined';
import LocalAtmOutlinedIcon from '@material-ui/icons/LocalAtmOutlined';
import SubdirectoryArrowRightOutlinedIcon from '@material-ui/icons/SubdirectoryArrowRightOutlined';
import { AccountCategory, AccountType } from '../model/enums';
import { Star } from '@material-ui/icons';
import '../styles/sidebar.scss';
import { getAmountString, prettifyEnum } from '../util/helpers';
import { Card } from './base/card';
import { useSageContext } from '../data/provider';

export const Sidebar: FunctionComponent = () => {
    const { resourceManager, state } = useSageContext();
    const [showZeroValueAccounts, setShowZeroValueAccounts] =
        useState<boolean>(false);

    useEffect(() => {
        resourceManager.sidebar();
    }, []);

    const selectAccount = (accountId: string | null) => {
        if (accountId && accountId === state.transactionTableView) {
            resourceManager.transactionTable();
        } else {
            resourceManager.transactionTable(accountId);
        }
    };

    const getIconForCategory = (category: AccountCategory) => {
        if (category === AccountCategory.DAILY) {
            return <LocalAtmOutlinedIcon className="daily" />;
        }
        if (category === AccountCategory.SPECIAL) {
            return <Star className="special" />;
        }
        if (category === AccountCategory.SAVINGS) {
            return <HouseOutlinedIcon className="savings" />;
        }
        if (category === AccountCategory.RETIREMENT) {
            return <AccountBalanceOutlinedIcon className="retirement" />;
        }
    };

    const pointIcon = <LoyaltyOutlinedIcon className="point" />;
    const childAccountIcon = (
        <SubdirectoryArrowRightOutlinedIcon className="childAccount" />
    );

    const getIconForType = (type: AccountType) => {
        if (type === AccountType.CASH) {
            return <MonetizationOnOutlinedIcon className="cash" />;
        }
        if (type === AccountType.LIABILITY) {
            return <CreditCardOutlinedIcon className="liability" />;
        }
        if (type === AccountType.INVESTMENT) {
            return <PollOutlinedIcon className="investment" />;
        }
        if (type === AccountType.POINT) {
            return <Star className="point" />;
        }
    };

    const renderAccount = (
        accountId: string,
        accountName: string,
        accountValue: number,
        isPoint: boolean,
        isRemaining: boolean,
        isChildAccount: boolean = false
    ) => (
        <>
            {accountValue !== 0 || showZeroValueAccounts ? (
                <div
                    key={accountId}
                    className={
                        state.transactionTableView === accountId
                            ? 'sidebar__accounts--account selected'
                            : 'sidebar__accounts--account'
                    }
                    onClick={() => selectAccount(accountId)}
                >
                    <p>
                        {isChildAccount ? childAccountIcon : null}
                        {accountName}
                    </p>
                    <p>
                        {accountValue < 0 ? (
                            <span className="negative">
                                {getAmountString(accountValue, isPoint)}
                            </span>
                        ) : (
                            getAmountString(accountValue, isPoint)
                        )}
                        {isRemaining ? (
                            <span className="subtext">rem.</span>
                        ) : null}
                        {isPoint ? pointIcon : null}
                    </p>
                </div>
            ) : null}
        </>
    );

    const getChildAccounts = (accountId: string, accounts: any[]) => {
        return accounts.filter((account) => {
            return account.parent_account_id === accountId;
        });
    };

    const sortAccounts = (a: any, b: any) => {
        if (a.is_remaining && !b.is_remaining) {
            return 1;
        }
        if (!a.is_remaining && b.is_remaining) {
            return -1;
        }

        return Math.abs(b.value) - Math.abs(a.value);
    };

    return (
        <div className="sidebar">
            <Card>
                <span
                    className="sidebar__total"
                    onClick={() => selectAccount(null)}
                >
                    <h1>
                        ${Math.floor(state.netWorth).toLocaleString('en-US')}
                    </h1>
                    <h2>
                        .
                        {Math.round(
                            (state.netWorth - Math.floor(state.netWorth)) * 100
                        ).toLocaleString('en-US')}
                    </h2>
                </span>
            </Card>
            <Card>
                {Object.entries(state.categoryValues).map((categoryEntry) => {
                    const categoryValue = Number.parseFloat(
                        categoryEntry[1] as string
                    );
                    const category =
                        AccountCategory[
                            categoryEntry[0] as keyof typeof AccountCategory
                        ];
                    return (
                        <div key={category} className="sidebar__category">
                            <h2>
                                {getIconForCategory(category)}
                                {prettifyEnum(AccountCategory[category])}
                            </h2>
                            <h2>
                                {categoryValue < 0 ? (
                                    <span className="negative">
                                        {getAmountString(
                                            categoryValue,
                                            category === AccountCategory.SPECIAL
                                        )}
                                        {category === AccountCategory.SPECIAL
                                            ? pointIcon
                                            : null}
                                    </span>
                                ) : (
                                    <>
                                        {getAmountString(
                                            categoryValue,
                                            category === AccountCategory.SPECIAL
                                        )}
                                        {category === AccountCategory.SPECIAL
                                            ? pointIcon
                                            : null}
                                    </>
                                )}
                            </h2>
                        </div>
                    );
                })}
            </Card>
            <div
                onClick={() => setShowZeroValueAccounts(!showZeroValueAccounts)}
            >
                {showZeroValueAccounts ? '- Hide' : '+ Show'} net 0 accounts
            </div>
            {Object.entries(state.typeValues).map((typeEntry) => {
                const typeBlob = typeEntry[1] as any;
                const typeAccounts: any[] = typeBlob.accounts;
                const type =
                    AccountType[typeEntry[0] as keyof typeof AccountType];
                const typeValue = typeBlob.sum;
                return (
                    <Card key={type}>
                        <div className="sidebar__type">
                            <h2>
                                {getIconForType(type)}
                                {prettifyEnum(AccountType[type])}
                            </h2>
                            <h2>
                                {typeValue < 0 ? (
                                    <span className="negative">
                                        {getAmountString(typeValue, false)}
                                    </span>
                                ) : (
                                    getAmountString(typeValue, false)
                                )}
                            </h2>
                        </div>
                        <div className="sidebar__accounts">
                            {typeAccounts
                                .filter(
                                    (account) =>
                                        account.parent_account_id === null ||
                                        account.parent_account_id === ''
                                )
                                .sort(sortAccounts)
                                .map((account) => {
                                    return (
                                        <>
                                            {renderAccount(
                                                account.id,
                                                account.name,
                                                account.value,
                                                account.is_points,
                                                account.is_remaining,
                                                false
                                            )}
                                            {getChildAccounts(
                                                account.id,
                                                typeAccounts
                                            )
                                                .sort(sortAccounts)
                                                .map((childAccount) => {
                                                    return renderAccount(
                                                        childAccount.id,
                                                        childAccount.name,
                                                        childAccount.value,
                                                        childAccount.is_points,
                                                        childAccount.is_remaining,
                                                        true
                                                    );
                                                })}
                                        </>
                                    );
                                })}
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};

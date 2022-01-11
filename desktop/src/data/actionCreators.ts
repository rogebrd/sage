import { Transaction } from "../types";
import { NavigateAction, SageActionType, SetAccountsAction, SetSummaryAction, SetTransactionsAction } from "./actions";
import { NavigationState } from "./state";

export const navigate = (
    destination: NavigationState
): NavigateAction => ({
    type: SageActionType.NAVIGATE,
    destination: destination
});

export const setSummaryData = (
    netWorth: number,
    categoryValues: any,
    typeValues: any
): SetSummaryAction => ({
    type: SageActionType.SET_SUMMARY,
    netWorth: netWorth,
    categoryValues: categoryValues,
    typeValues: typeValues
})

export const setTransactions = (
    transactions: Transaction[]
): SetTransactionsAction => ({
    type: SageActionType.SET_TRANSACTIONS,
    transactions: transactions
})

export const setAccounts = (
    accounts: any[]
): SetAccountsAction => ({
    type: SageActionType.SET_ACCOUNTS,
    accounts: accounts
})
import { Transaction } from '../types';
import { NavigationState } from './state';

export enum SageActionType {
    NAVIGATE = 'NAVIGATE',
    SET_SUMMARY = 'SET_SUMMARY',
    SET_TRANSACTIONS = 'SET_TRANSACTIONS',
    SET_ACCOUNTS = 'SET_ACCOUNTS',
}

export interface NavigateAction {
    type: SageActionType.NAVIGATE;
    destination: NavigationState;
}

export interface SetSummaryAction {
    type: SageActionType.SET_SUMMARY;
    netWorth: number;
    categoryValues: any;
    typeValues: any;
    lastUpdated: Date;
}

export interface SetTransactionsAction {
    type: SageActionType.SET_TRANSACTIONS;
    transactionTableView: string;
    transactions: Transaction[];
}

export interface SetAccountsAction {
    type: SageActionType.SET_ACCOUNTS;
    accounts: any[];
}

export type SageActions =
    | NavigateAction
    | SetSummaryAction
    | SetTransactionsAction
    | SetAccountsAction;

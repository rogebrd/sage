import { Transaction } from '../types';

export enum NavigationState {
    LOGIN = 'LOGIN',
    HOME = 'HOME',
}

export interface SageState {
    navigationState: NavigationState;
    netWorth: number;
    categoryValues: any;
    typeValues: any;
    transactions: Transaction[];
    accounts: any[];
    lastUpdated: Date;
    transactionTableView: string;
}

export const createInitialState = (): SageState => {
    return {
        navigationState: NavigationState.LOGIN,
        netWorth: 0,
        categoryValues: {},
        typeValues: {},
        transactions: [],
        accounts: [],
        lastUpdated: new Date(),
        transactionTableView: '',
    };
};

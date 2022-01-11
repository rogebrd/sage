import { Transaction } from "../types"

export enum NavigationState {
    LOGIN = "LOGIN",
    HOME = "HOME"
}

export interface SageState {
    navigationState: NavigationState;
    netWorth: number;
    categoryValues: any;
    typeValues: any;
    transactions: Transaction[];
    accounts: any[];
}

export const createInitialState = (): SageState => {
    return {
        navigationState: NavigationState.LOGIN,
        netWorth: 0,
        categoryValues: {},
        typeValues: {},
        transactions: [],
        accounts: []
    }
}
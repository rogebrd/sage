import { SageActions, SageActionType } from './actions';
import { SageState } from './state';

export const sageReducer = (
    state: SageState,
    action: SageActions
): SageState => {
    switch (action.type) {
        case SageActionType.NAVIGATE:
            return {
                ...state,
                navigationState: action.destination,
            };
        case SageActionType.SET_SUMMARY:
            return {
                ...state,
                netWorth: action.netWorth,
                categoryValues: action.categoryValues,
                typeValues: action.typeValues,
            };
        case SageActionType.SET_ACCOUNTS:
            return {
                ...state,
                accounts: action.accounts,
            };
        case SageActionType.SET_TRANSACTIONS:
            return {
                ...state,
                transactionTableView: action.transactionTableView,
                transactions: action.transactions,
            };
    }
    return state;
};

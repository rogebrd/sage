import { Action } from "./action";

export interface AccountOptions {
    id: string;
    name: string;
    type: AccountType;
    currency: AccountCurrency;
    childAccounts?: Account[];
    actions?: Action[];
    balance: number;
}

export enum AccountType {
    CASH,
    INVESTMENT,
    LIABILITY,
    ALLOWANCE,
    PHYSICAL,
    TAX
}

export enum AccountCurrency {
    USD,
    POINT
}

export class Account implements AccountOptions {
    // Account Options
    id: string;
    name: string;
    type: AccountType;
    currency: AccountCurrency;
    childAccounts: Account[] | undefined;
    actions?: any[] | undefined;
    balance: number;

    constructor(options: AccountOptions) {
        this.id = options.id;
        this.name = options.name;
        this.type = options.type;
        this.currency = options.currency;
        this.childAccounts = options.childAccounts;
        this.actions = options.actions;
        this.balance = options.balance;
    }
}
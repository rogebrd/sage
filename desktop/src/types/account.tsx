import { Action } from "./action";

export interface AccountOptions {
    id: string;
    name: string;
    type: AccountType;
    currency: AccountCurrency;
    childAccounts?: Account[];
    actions: Action[];
    balance: number;
}

export enum AccountType {
    CASH,
    INVESTMENT,
    LIABILITY,
    POINT,
}

export enum AccountCurrency {
    USD,
    POINT
}

export class Account implements AccountOptions {
    id: string;
    name: string;
    type: AccountType;
    currency: AccountCurrency;
    childAccounts: Account[] | undefined;
    actions: Action[];
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

    getBalance() {
        let totalBalance: { [key: number]: number } = {};

        let balance = 0;
        for (let action of this.actions) {
            balance += action.getAmount();
        }
        totalBalance[this.type] = balance;

        if (this.childAccounts) {
            for (let childAccount of this.childAccounts) {
                let childBalance = childAccount.getBalance();
                for (let [type, balance] of Object.entries(childBalance)) {
                    let newBalance = 0;
                    if (totalBalance[Number.parseInt(type)]) {
                        newBalance += totalBalance[Number.parseInt(type)];
                    }
                    newBalance += balance;
                    totalBalance[Number.parseInt(type)] = newBalance;
                }
            }
        }

        return totalBalance;
    }
}
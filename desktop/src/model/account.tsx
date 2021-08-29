import { Entry } from "./entry";
import { AccountCurrency, AccountType } from "./enums";

export interface AccountOptions {
    id: string;
    name: string;
    type: AccountType;
    currency: AccountCurrency;
    category: string;
}

export class Account implements AccountOptions {

    constructor(options: AccountOptions) {
        this.id = options.id;
        this.name = options.name;
        this.type = options.type;
        this.currency = options.currency;
        this.category = options.category;
    }

    id: string;
    name: string;
    type: AccountType;
    currency: AccountCurrency;
    category: string;

    getEntries(entries: Entry[]) {
        return entries.filter((entry) => entry.accountId === this.id)
    }
}
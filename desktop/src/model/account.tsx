import { Entry } from "./entry";
import { AccountCategory, AccountType } from "./enums";

export interface AccountOptions {
    id: string;
    name: string;
    type: AccountType;
    category: AccountCategory;
    parentAccountId?: string;
    maxValue?: number;
}

export class Account implements AccountOptions {

    constructor(options: AccountOptions) {
        this.id = options.id;
        this.name = options.name;
        this.type = options.type;
        this.category = options.category;
        this.parentAccountId = options.parentAccountId;
        this.maxValue = options.maxValue;
    }

    id: string;
    name: string;
    type: AccountType;
    category: AccountCategory;
    parentAccountId: string | undefined;
    maxValue: number | undefined;

    getEntries(allEntries: Entry[]) {
        return allEntries.filter((entry) => entry.accountId === this.id)
    }

    getValue(allEntries: Entry[], date: Date = new Date()) {
        const entrySum = allEntries
            .filter((entry) => entry.accountId === this.id)
            .reduce((total: number, current: Entry) => total + current.getValue(date), 0);
        return this.maxValue ? this.maxValue - entrySum : entrySum;
    }

    getChildAccounts(allAccounts: Account[]) {
        return allAccounts.filter((account) => account.parentAccountId && account.parentAccountId === this.id)
    }
}
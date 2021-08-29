import { Entry } from "./entry";
import { AccountCurrency, AccountType } from "./enums";

export interface TransactionOptions {
    id: string;
    entryIds: string[];
}

export class Transaction implements TransactionOptions {

    constructor(options: TransactionOptions) {
        this.id = options.id;
        this.entryIds = options.entryIds;
    }

    id: string;
    entryIds: string[];

    getEntries(entries: Entry[]) {
        return entries.filter((entry) => entry.id in this.entryIds)
    }
}
import { Entry } from "./entry";

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
        return entries.filter((entry) => this.entryIds.includes(entry.id))
    }
}
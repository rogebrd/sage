import { Account } from "./account";
import { EntryStyle } from "./enums";

export interface EntryOptions {
    id: string;
    accountId: string;
    style: EntryStyle;
    amount: number | StockAmount;
    date: Date;
    category?: string;
    tags?: string[];
    description?: string;
}

export interface StockAmount {
    quantity: number;
    symbol: string;
    unitPrice: number;
}

export class Entry implements EntryOptions {

    constructor(options: EntryOptions) {
        this.id = options.id;
        this.accountId = options.accountId;
        this.style = options.style;
        this.amount = options.amount;
        this.date = options.date;
        this.category = options.category;
        this.tags = options.tags;
        this.description = options.description;
    }

    id: string;
    accountId: string;
    style: EntryStyle;
    amount: number | StockAmount;
    date: Date;
    category?: string | undefined;
    tags?: string[] | undefined;
    description?: string | undefined;

    getValue(date: Date) {
        // Return for date before this entry took place
        if (date < this.date) {
            return 0;
        }

        const multiplier = (this.style === EntryStyle.CREDIT) ? -1 : 1;

        if (typeof this.amount === 'number') {
            return multiplier * this.amount;
        } else {
            // TODO update to reflect appreciation of ticket
            return multiplier * this.amount.quantity * this.amount.unitPrice;
        }
    }

    getAccount(accounts: Account[]) {
        return accounts.filter((account) => account.id === this.id)[0];
    }

}
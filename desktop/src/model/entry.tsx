import { Account } from './account';
import { EntryStyle } from './enums';

export interface EntryOptions {
    id?: string;
    accountId?: string;
    style?: EntryStyle;
    amount?: number | StockAmount;
    date?: number;
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
        if (
            !options.id ||
            !options.accountId ||
            options.style === undefined ||
            options.amount === undefined ||
            options.date === undefined
        ) {
            throw new Error(``);
        }

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
    date: number;
    category?: string | undefined;
    tags?: string[] | undefined;
    description?: string | undefined;

    getValue(date: Date, stockPrices?: any) {
        // Return for date before this entry took place
        if (date < new Date(this.date)) {
            return 0;
        }

        const multiplier = this.style === EntryStyle.CREDIT ? -1 : 1;

        if (typeof this.amount === 'number') {
            return multiplier * this.amount;
        } else {
            // TODO update to reflect appreciation of ticket
            const price =
                stockPrices && stockPrices[this.amount.symbol] !== undefined
                    ? stockPrices[this.amount.symbol]
                    : this.amount.unitPrice;
            return multiplier * this.amount.quantity * price;
        }
    }

    getAccount(accounts: Account[]) {
        return accounts.filter((account) => account.id === this.id)[0];
    }
}

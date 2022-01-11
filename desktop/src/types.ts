import { EntryStyle } from './model/enums';

export type Transaction = {
    id: string;
    date: Date;
    entries: Entry[];
};

export type StockAmount = {
    quantity: number;
    symbol: string;
    unitPrice: number;
};

export type Entry = {
    id: string;
    accountId: string;
    style: EntryStyle;
    amount: number | StockAmount;
    date: Date;
    category?: string | undefined;
    tags?: string[] | undefined;
    description?: string | undefined;
};

// RAW TYPES
// ***********************************

export type EntryRaw = {
    id: string;
    account_id: string;
    style: string;
    amount: string;
    date: string;
    category?: string | undefined;
    tags?: string[] | undefined;
    description?: string | undefined;
};

export type TransactionRaw = {
    id: string;
    date: string;
    entries: EntryRaw[];
};

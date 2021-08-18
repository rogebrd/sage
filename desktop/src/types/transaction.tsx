import { Action } from "./action";

export interface TransactionOptions {
    id: string;
    actions: Action[];
}

export class Transaction implements TransactionOptions {
    // Transaction Options
    id: string;
    actions: Action[];

    constructor(options: TransactionOptions) {
        this.id = options.id;
        this.actions = options.actions;
    }
}
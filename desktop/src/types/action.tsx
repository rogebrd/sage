export interface ActionOptions {
    id: string;
    accountId: string;
    style: ActionStyle;
    amount: number;
    tag?: string;
    transactionId: string;
    date: Date;
    category?: string;
}

export enum ActionStyle {
    CREDIT,
    DEBIT
}

export class Action implements ActionOptions {
    id: string;
    accountId: string;
    style: ActionStyle;
    amount: number;
    tag?: string | undefined;
    transactionId: string;
    date: Date;
    category: string | undefined;

    constructor(options: ActionOptions) {
        this.id = options.id;
        this.accountId = options.accountId;
        this.style = options.style;
        this.amount = options.amount;
        this.tag = options.tag;
        this.transactionId = options.transactionId;
        this.date = options.date;
        this.category = options.category;
    }

    getAmount() {
        if (this.style === ActionStyle.CREDIT) {
            return -1 * this.amount;
        } else {
            return this.amount;
        }
    }
}
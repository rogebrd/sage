import { Action, ActionOptions, ActionStyle } from "./action";

export interface StockActionOptions extends ActionOptions {
    symbol: string;
    unitPrice: number;
    quantity: number;
}

export class StockAction extends Action implements StockActionOptions {
    // Stock Action Options
    symbol: string;
    unitPrice: number;
    quantity: number;

    constructor(options: StockActionOptions) {
        super(options);
        this.symbol = options.symbol;
        this.unitPrice = options.unitPrice;
        this.quantity = options.quantity;
    }
}
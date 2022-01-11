import { Account } from '../model/account';
import { Entry, StockAmount } from '../model/entry';
import { AccountCategory, AccountType, EntryStyle } from '../model/enums';
import { Transaction } from '../model/transaction';

export const accountFromDynamoDB = (accountRaw: any): Account => {
    return new Account({
        id: accountRaw.AccountId.S,
        name: accountRaw.Name.S,
        type: AccountType[accountRaw.Type.S as keyof typeof AccountType],
        category:
            AccountCategory[
                accountRaw.Category?.S as keyof typeof AccountCategory
            ],
        parentAccountId: accountRaw.ParentAccountId?.S,
        maxValue: Number.parseFloat(accountRaw.MaxValue?.S),
    });
};

export const entryFromDynamoDB = (entryRaw: any): Entry => {
    return new Entry({
        id: entryRaw.EntryId.S,
        accountId: entryRaw.AccountId.S,
        style: EntryStyle[entryRaw.Style.S as keyof typeof EntryStyle],
        amount: parseAmount(entryRaw.Amount.S),
        date: Number.parseInt(entryRaw.Date.N),
        category: entryRaw.Category?.S,
        tags: entryRaw.Tags?.SS,
        description: entryRaw.Description?.S,
    });
};

export const transactionFromDynamoDB = (transactionRaw: any): Transaction => {
    return new Transaction({
        id: transactionRaw.TransactionId.S,
        entryIds: transactionRaw.EntryIds.SS,
    });
};

const parseAmount = (amountString: string): number | StockAmount => {
    const asFloat = Number.parseFloat(amountString);
    if (!isNaN(asFloat)) {
        return asFloat;
    } else {
        amountString = amountString.replaceAll("'", '"');
        const amountRaw = JSON.parse(amountString);
        return {
            quantity: Number.parseFloat(amountRaw.quantity),
            unitPrice: Number.parseFloat(amountRaw.unitPrice),
            symbol: amountRaw.symbol,
        };
    }
};

import { StockAmount } from '../model/entry';
import { AccountType } from '../model/enums';

export const prettifyEnum = (string: string) => {
    let s = string.toLowerCase();
    return s[0].toUpperCase() + s.slice(1);
};

export const getTypeColor = (type: AccountType) => {
    if (type === AccountType.CASH) {
        return '#E1B92B';
    }
    if (type === AccountType.LIABILITY) {
        return '#574DC7';
    }
    if (type === AccountType.INVESTMENT) {
        return '#5A8A0B';
    }
};

export const getStockAmountString = (amount: StockAmount) => {
    return `${amount.quantity}x${amount.symbol} @ $${amount.unitPrice}`;
};

export const getAmountString = (amount: number, isPoint: boolean) => {
    return `
    ${amount < 0 ? '-' : ''}${!isPoint ? '$' : ''}${
        !isPoint
            ? Math.abs(amount).toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
              })
            : amount.toLocaleString('en-US', { maximumFractionDigits: 0 })
    }
    `;
};

const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
];
export const formatDate = (date: Date) => {
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const formatDateForInput = (dateNumber: Date | undefined) => {
    let date = new Date();
    if (dateNumber) {
        date = dateNumber;
    }
    return `${date.getFullYear()}-${
        date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    }-${date.getDate() < 9 ? '0' + (date.getDate() + 1) : date.getDate() + 1}`;
};

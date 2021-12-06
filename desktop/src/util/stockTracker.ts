import { Entry, StockAmount } from "../model/entry"
import { yahooFinanceApiClient } from "./axios";

const FETCH_BATCH_SIZE = 10;
export const fetchStockPrices = (entries: Entry[], stockPrices: any) => {
    const symbolsToFetch = entries.map((entry) => entry.amount)
        .filter((amount) => typeof amount !== 'number')
        .map((amount) => amount as StockAmount)
        .map((amount) => amount.symbol)
        .filter((symbol) => stockPrices[symbol] === undefined);
    console.log(`Fetching ${symbolsToFetch.join(", ")}`);
    let updatedStockPrices = stockPrices;
    let i = 0;
    while (i < symbolsToFetch.length) {
        let symbolsInBatch: string[] = [];
        if (i + FETCH_BATCH_SIZE > symbolsToFetch.length) {
            symbolsInBatch = symbolsToFetch.slice(i, symbolsToFetch.length);
        } else {
            symbolsInBatch = symbolsToFetch.slice(i, i + FETCH_BATCH_SIZE);
        }
        const url = `/v6/finance/quote?region=US&lang=en&symbols=${symbolsInBatch.join("%2C")}`;
        yahooFinanceApiClient.get(url).then((response) => {
            const quotes = response.data.quoteResponse.result;
            quotes.forEach((quote: any) => {
                const symbol = quote.symbol;
                const price = quote.regularMarketPrice;
                updatedStockPrices[symbol] = price;
            })
        }).catch((error) => {
            console.log(error);
        });
        i += FETCH_BATCH_SIZE;
    }
    return updatedStockPrices;
}
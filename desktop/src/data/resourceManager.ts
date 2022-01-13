import axios, { AxiosInstance } from 'axios';
import { EntryStyle } from '../model/enums';
import { Entry, EntryRaw, TransactionRaw } from '../types';
import {
    navigate,
    setAccounts,
    setSummaryData,
    setTransactions,
} from './actionCreators';
import { Dispatch } from './provider';
import { NavigationState } from './state';

const BASE_AXIOS_CONFIG = {
    baseURL: 'http://localhost:5000',
    timeout: 100000,
};

export class ResourceManager {
    noAuthClient: AxiosInstance;
    authClient: AxiosInstance | null;
    dispatch: Dispatch;
    authenticated: boolean;

    constructor(dispatch: Dispatch) {
        this.noAuthClient = axios.create(BASE_AXIOS_CONFIG);
        this.authClient = null;
        this.dispatch = dispatch;
        this.authenticated = false;
        const existing_token = localStorage.getItem('access_token');
        if (existing_token && existing_token !== 'null') {
            this.createAuthClient(existing_token);
        }
    }

    login(password: string): void {
        window.crypto.subtle
            .digest('SHA-256', new TextEncoder().encode(password))
            .then((digestedHash) => {
                const hashArray = Array.from(new Uint8Array(digestedHash));
                const hashHex = hashArray
                    .map((b) => b.toString(16).padStart(2, '0'))
                    .join('');
                console.log(hashHex);
                this.noAuthClient
                    .post('/login', {
                        login_sha: hashHex,
                    })
                    .then((response: any) => {
                        this.createAuthClient(response.data.access_token);
                        this.dispatch(navigate(NavigationState.HOME));
                    });
            });
    }

    createAuthClient(token: string): void {
        this.authClient = axios.create(BASE_AXIOS_CONFIG);
        this.authClient.interceptors.request.use((config: any) => {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        });
        localStorage.setItem('access_token', token);
        this.authenticated = true;
    }

    sidebar() {
        this.authClient?.get('/sidebar').then((response) => {
            const data = response.data;
            this.dispatch(
                setSummaryData(
                    data.net_worth,
                    data.category_sums,
                    data.type_data,
                    new Date(data.last_updated)
                )
            );
        });
    }

    transactionTable(accountId: string | null = null) {
        let body;
        if (accountId !== null) {
            body = {
                account_id: accountId,
            };
        }
        this.authClient?.post('/transaction/table', body).then((response) => {
            const transactions: TransactionRaw[] = response.data.transactions;
            const normalizedTransactions = [];
            for (let transaction of transactions) {
                const normalizedTransaction = {
                    id: transaction.id,
                    date: new Date(Number.parseInt(transaction.date)),
                    entries: this.normalizeEntries(transaction.entries),
                };

                normalizedTransactions.push(normalizedTransaction);
            }
            this.dispatch(setTransactions(normalizedTransactions, accountId ? accountId : ""));
        });
    }

    accounts() {
        this.authClient?.get('/modal/options').then((response) => {
            this.dispatch(setAccounts(response.data.accounts));
        });
    }

    normalizeEntries(entries: EntryRaw[]): Entry[] {
        return entries.map((entry: EntryRaw) => {
            let amount;
            try {
                amount = JSON.parse(entry.amount.replaceAll("'", '"'));
            } catch (e) {
                amount = Number.parseFloat(entry.amount);
            }
            return {
                id: entry.id,
                accountId: entry.account_id,
                style: EntryStyle[entry.style as keyof typeof EntryStyle],
                amount: amount,
                date: new Date(Number.parseFloat(entry.date)),
                category: entry.category,
                tags: entry.tags,
                description: entry.description,
            };
        });
    }
}

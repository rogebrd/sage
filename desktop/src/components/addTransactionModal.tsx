import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import { Account } from "../model/account";
import { Button, Modal } from "@material-ui/core";
import { allEntryStyles, EntryStyle } from "../model/enums";
import { client } from "../util/axios";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { formatDateForInput, prettifyEnum } from "../util/helpers";
import { Card } from "./base/card";
import { Entry, StockAmount } from "../model/entry";
import { Transaction } from "../model/transaction";
import { StockAmountModal } from "./stockAmountModal";

type AddTransactionModalProps = {
    visible: boolean,
    setVisible: Function,
    accounts: Account[],
    entries: Entry[],
    transactions: Transaction[],
    newTransactionCallback: Function,
    newEntryCallback: Function,
    existingTransaction?: Transaction
}

export const AddTransactionModal: FunctionComponent<AddTransactionModalProps> = ({ visible, setVisible, accounts, entries, transactions, newTransactionCallback, newEntryCallback, existingTransaction }) => {
    const [transactionId, setTransactionId] = useState<string>("");
    const [newEntries, setNewEntries] = useState<Partial<Entry>[]>([]);

    const getNextTransactionId = useCallback((): string => {
        const maxId = transactions
            .map((account) => Number.parseInt(account.id))
            .reduce((total, current) => {
                if (current > total) {
                    return current;
                } else {
                    return total;
                }
            }, 0)
        return (maxId + 1).toString()
    }, [transactions]);

    useEffect(() => {
        if (existingTransaction) {
            setTransactionId(existingTransaction.id);
            setNewEntries(existingTransaction.getEntries(entries));
        } else {
            setTransactionId(getNextTransactionId());
        }
    }, [existingTransaction, entries, getNextTransactionId]);

    const defaultEntryValues: Partial<Entry> = {
        accountId: accounts[0]?.id,
        style: EntryStyle.DEBIT,
        amount: 0,
        date: new Date().valueOf(),
        category: '',
        tags: [],
        description: ''
    }

    const getNextEntryId = (): string => {
        const maxId = entries
            .map((entry) => Number.parseInt(entry.id))
            .concat(newEntries.map((newEntry) => Number.parseInt(newEntry?.id ? newEntry.id : "-1")))
            .reduce((total, current) => {
                if (current > total) {
                    return current;
                } else {
                    return total;
                }
            }, 0)
        return (maxId + 1).toString()
    }

    const addTransaction = (event: any) => {
        event.preventDefault();
        const transaction = new Transaction({
            id: transactionId,
            entryIds: newEntries.map((entry) => entry?.id || "-1")
        });

        const fullEntries = newEntries
            .map((entry) => { return { ...defaultEntryValues, ...entry } })
            .map((entry) => new Entry(entry));

        const newTransactionJson = {
            transaction: {
                id: transaction.id,
                entryIds: transaction.entryIds
            },
            entries: fullEntries
                .map((entry) => {
                    let formattedAmount;
                    if (typeof entry.amount === 'number') {
                        formattedAmount = entry.amount.toString()
                    } else {
                        formattedAmount = entry.amount;
                    }
                    return {
                        id: entry.id,
                        accountId: entry.accountId,
                        style: EntryStyle[entry.style],
                        amount: formattedAmount,
                        date: entry.date.toString(),
                        description: entry.description,
                        category: entry.category,
                        tags: entry.tags
                    }
                })
        }

        client.post("/transaction", newTransactionJson).then((response) => {
            clearState();
            setVisible(false);
            newEntryCallback(fullEntries);
            newTransactionCallback(transaction);
        }).catch((exception) => {
            console.error(exception);
        });
    }

    const clearState = () => {
        setNewEntries([]);
    }

    const updateEntry = (update: any) => {
        let exisitngEntry = newEntries.find((entry) => entry.id === update.id);
        if (!exisitngEntry) {
            update.id = getNextEntryId();
            setNewEntries(newEntries.concat({ ...update }));
        } else {
            let newEntry = { ...exisitngEntry, ...update };
            setNewEntries(newEntries.map((entry, index) => exisitngEntry?.id === entry.id ? newEntry : entry))
        }
    }

    const removeEntry = (newEntryId: string) => {
        setNewEntries(newEntries
            .filter((entry) => {
                return entry.id !== newEntryId
            })
        );
    }

    return (
        <Modal
            className="modal"
            open={visible}
        >
            <div className="modal__content">
                <Card>
                    <span className="modal__content--header">
                        <h1>New Transaction</h1>
                        <Button onClick={() => setVisible(false)}><CloseOutlinedIcon /></Button>
                    </span>
                    <span className="modal__content--input">
                        <table>
                            <thead>
                                <tr>
                                    <th><h2>Account *</h2></th>
                                    <th><h2>Style *</h2></th>
                                    <th><h2>Amount *</h2></th>
                                    <th><h2>Date *</h2></th>
                                    <th><h2>Category</h2></th>
                                    <th><h2>Tags</h2></th>
                                    <th><h2>Description</h2></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    newEntries.concat(defaultEntryValues).map((entry, index) => (
                                        <AddEntryRow
                                            key={index}
                                            entry={entry}
                                            updateEntryCallback={updateEntry}
                                            accounts={accounts}
                                            removeEntry={removeEntry}
                                        />
                                    ))
                                }
                            </tbody>
                        </table>
                    </span>
                    <Button className="modal__addAccount__content--submit" onClick={addTransaction}><h2>Create</h2></Button>
                </Card>
            </div>
        </Modal >
    );
}

type AddEntryRowProps = {
    entry: Partial<Entry>
    updateEntryCallback: Function,
    accounts: Account[],
    removeEntry: Function,
}

const AddEntryRow: FunctionComponent<AddEntryRowProps> = ({ entry, updateEntryCallback, accounts, removeEntry }) => {
    const [isStockType, setIsStockType] = useState(false);
    const [showStockAmountModal, setShowStockAmountModal] = useState(false);

    const toggleAmountType = () => {

        if (!isStockType) {
            setShowStockAmountModal(true);
        }

        if (entry.amount) {
            const newDefault = !isStockType ? { symbol: "", quantity: 0, unitPrice: 0 } : 0;
            updateEntryCallback({
                id: entry.id,
                amount: newDefault
            });
        }

        setIsStockType(!isStockType);
    }

    const setStockAmount = (amount: StockAmount) => {
        setShowStockAmountModal(false);
        updateEntryCallback({
            id: entry.id,
            amount: amount
        });
    }

    return (
        <tr>
            <td>
                <select value={entry.accountId} onChange={(event) => updateEntryCallback({ id: entry.id, accountId: event.target.value })}>
                    {
                        accounts
                            .map((account) => (
                                <option key={account.id} value={account.id}>{account.parentAccountId}-{account.name}</option>
                            ))
                    }
                </select>
            </td>
            <td>
                <select value={entry.style} onChange={(event) => updateEntryCallback({ id: entry.id, style: Number.parseInt(event.target.value) as EntryStyle })}>
                    {
                        allEntryStyles
                            .map((style) => (
                                <option key={style} value={style}>{prettifyEnum(EntryStyle[style])}</option>
                            ))
                    }
                </select>
            </td>
            <td>
                <input type="checkbox" checked={isStockType} onChange={() => toggleAmountType()} />
                {
                    isStockType ?
                        (<p>
                            {(entry.amount as StockAmount)?.quantity?.toString() || "?"}x{(entry.amount as StockAmount)?.symbol || "?"} @ ${(entry.amount as StockAmount)?.unitPrice || "?"}
                        </p>) :
                        (<input type="number" value={entry.amount?.toString()} onChange={(event) => updateEntryCallback({ id: entry.id, amount: Number.parseFloat(event.target.value) })} />)
                }
                <StockAmountModal visible={showStockAmountModal} setVisible={setShowStockAmountModal} setAmountCallback={setStockAmount} />
            </td>
            <td>
                <input type="date" value={formatDateForInput(entry.date)} onChange={(event) => updateEntryCallback({ id: entry.id, date: new Date(Date.parse(event.target.value).valueOf() + 14400000).valueOf() })} />
            </td>
            <td>
                <input type="text" value={entry.category} onChange={(event) => updateEntryCallback({ id: entry.id, category: event.target.value })} />
            </td>
            <td>
                <input type="text" value={entry.tags?.join(", ")} onChange={(event) => updateEntryCallback({ id: entry.id, tags: event.target.value.split(", ") })} />
            </td>
            <td>
                <input type="text" value={entry.description} onChange={(event) => updateEntryCallback({ id: entry.id, description: event.target.value })} />
            </td>
            <td>
                {
                    entry.id ? (<Button onClick={() => removeEntry(entry.id)}><CloseOutlinedIcon /></Button>) : null
                }
            </td>
        </tr >
    );
}
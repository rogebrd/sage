import React, { FunctionComponent } from "react";
import { Modal } from "./base/modal";
import { Button } from "./base/button";
import { Account } from "../types/account";
import { Transaction } from "../types/transaction";

type AddTransactionModalProps = {
    accounts: Account[],
    addTransactionCallback: Function
}

export const AddTransactionModal: FunctionComponent<AddTransactionModalProps> = ({ accounts, addTransactionCallback }) => {
    const [isVisible, setVisibility] = React.useState(false);
    const [transactionDate, setTransactionDate] = React.useState(new Date());
    const [transactionVendor, setTransactionVendor] = React.useState("");
    const [transactionAccountIndex, setTransactionAccountIndex] = React.useState(0);
    const [transactionAmount, setTransactionAmount] = React.useState(0.00);
    const [transactionCategory, setTransactionCategory] = React.useState("");

    const addTransaction = (event: any) => {
        event.preventDefault()
        let newTransaction: Transaction = {
            id: 10,
            date: transactionDate,
            vendor: transactionVendor,
            accountIndex: transactionAccountIndex,
            amount: transactionAmount,
            category: transactionCategory
        }
        addTransactionCallback(newTransaction);
        clearState();
    }

    const clearState = () => {
        setVisibility(false);
        setTransactionDate(new Date());
        setTransactionVendor("");
        setTransactionAccountIndex(0);
        setTransactionAmount(0.00);
        setTransactionCategory("");
    }

    return (
        <>
            <Button text="Add Transaction" onClick={() => setVisibility(true)} />
            <Modal
                title="New Transaction"
                content={
                    <>
                        <label>Date: </label>
                        <input id="transactionDate" type="date" value={transactionDate.toString()} onChange={(change) => setTransactionDate(new Date(change.target.value))}></input>
                        <label>Vendor: </label>
                        <input id="transactionVendor" type="text" value={transactionVendor} onChange={(change) => setTransactionVendor(change.target.value)}></input>
                        <label>Account: </label>
                        <select id="transactionAccount" value={transactionAccountIndex} onChange={(change) => setTransactionAccountIndex(parseInt(change.target.value))}>
                            {
                                accounts.map((account, index) =>
                                    (<option key={index} value={index}>{account.name}</option>)
                                )
                            }
                        </select>
                        <label>Amount: </label>
                        <input id="transactionAmount" type="number" value={transactionAmount} onChange={(change) => setTransactionAmount(parseFloat(change.target.value))}></input>
                        <label>Category: </label>
                        <input id="transactionCategory" type="text" value={transactionCategory} onChange={(change) => setTransactionCategory(change.target.value)}></input>
                    </>
                }
                onSubmit={addTransaction}
                onCancel={clearState}
                isVisible={isVisible}
            />
        </>
    );
}
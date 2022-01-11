import React, { FunctionComponent, useEffect, useState } from "react";
import { Account } from "../model/account";
import { Button, Modal } from "@material-ui/core";
import { AccountCategory, AccountType, allAccountCategories, allAccountTypes } from "../model/enums";
import { client } from "../util/axios";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { prettifyEnum } from "../util/helpers";
import { Card } from "./base/card";
import { useSageContext } from "../data/provider";

type AddAccountModalProps = {
    visible: boolean,
    setVisible: Function,
}

export const AddAccountModal: FunctionComponent<AddAccountModalProps> = ({ visible, setVisible }) => {
    const { resourceManager, state } = useSageContext();
    const [newAccountName, setNewAccountName] = useState('');
    const [newAccountType, setNewAccountType] = useState<AccountType>(AccountType.CASH);
    const [newAccountCategory, setNewAccountCategory] = useState<AccountCategory>(AccountCategory.DAILY);
    const [newAccountMaxValue, setNewAccountMaxValue] = useState<string | undefined>(undefined);
    const [newAccountParentAccountId, setNewAccountParentAccountId] = useState<string | undefined>(undefined);

    const getNextId = (): string => {
        const maxId = state.accounts
            .map((account) => Number.parseInt(account.id))
            .reduce((total, current) => {
                if (current > total) {
                    return current;
                } else {
                    return total;
                }
            }, 0)
        return (maxId + 1).toString()
    }

    const addAccount = (event: any) => {
        event.preventDefault()
        const id = getNextId()
        let newAccount: Account = new Account({
            id: id,
            name: newAccountName,
            type: newAccountType,
            category: newAccountCategory,
            maxValue: newAccountMaxValue ? Number.parseFloat(newAccountMaxValue) : undefined,
            parentAccountId: newAccountParentAccountId
        });
        const newAccountJson = {
            account: {
                id: id,
                name: newAccountName,
                type: AccountType[newAccountType],
                category: AccountCategory[newAccountCategory],
                maxValue: newAccountMaxValue,
                parentAccountId: newAccountParentAccountId
            }
        };
        client.post("api/account", newAccountJson).then((response) => {
            clearState();
            setVisible(false);
        }).catch((exception) => {
            console.error(exception);
        });
    }

    const clearState = () => {
        setNewAccountName('');
        setNewAccountType(AccountType.CASH);
        setNewAccountCategory(AccountCategory.DAILY);
        setNewAccountMaxValue(undefined);
        setNewAccountParentAccountId(undefined);
    }

    return (
        <Modal
            className="modal"
            open={visible}
        >
            <div className="modal__content">
                <Card>
                    <span className="modal__content--header">
                        <h1>New Account</h1>
                        <Button onClick={() => setVisible(false)}><CloseOutlinedIcon /></Button>
                    </span>
                    <span className="modal__content--input">
                        <span className="modal__content--input-required">
                            <h2>Name</h2>
                            <p>*</p>
                        </span>
                        <input type="text" value={newAccountName} onChange={(event) => setNewAccountName(event.target.value)}></input>
                    </span>
                    <span className="modal__content--input">
                        <span className="modal__content--input-required">
                            <h2>Type</h2>
                            <p>*</p>
                        </span>
                        <select value={newAccountType} onChange={(event) => setNewAccountType(Number.parseInt(event.target.value) as AccountType)}>
                            {
                                allAccountTypes.map((type) => (
                                    <option key={type} value={type}>{prettifyEnum(AccountType[type])}</option>
                                ))
                            }
                        </select>
                    </span>
                    <span className="modal__content--input">
                        <span className="modal__content--input-required">
                            <h2>Category</h2>
                            <p>*</p>
                        </span>
                        <select value={newAccountCategory} onChange={(event) => setNewAccountCategory(Number.parseInt(event.target.value) as AccountCategory)}>
                            {
                                allAccountCategories.map((category) => (
                                    <option key={category} value={category}>{prettifyEnum(AccountCategory[category])}</option>
                                ))
                            }
                        </select>
                    </span>
                    <span className="modal__content--input">
                        <h2>Max Value</h2>
                        <input value={newAccountMaxValue} onChange={(event) => setNewAccountMaxValue(event.target.value)} type="text"></input>
                    </span>
                    <span className="modal__content--input">
                        <h2>Parent Account</h2>
                        <select value={newAccountParentAccountId} onChange={(event) => setNewAccountParentAccountId(event.target.value)}>
                            <option value="">None</option>
                            {
                                state.accounts
                                    .filter((account) => !account.parentAccountId)
                                    .map((account) => (
                                        <option key={account.id} value={account.id}>{account.name}</option>
                                    ))
                            }
                        </select>
                    </span>
                    <Button className="modal__content--submit" onClick={addAccount}><h2>Create</h2></Button>
                </Card>
            </div>
        </Modal >
    );
}
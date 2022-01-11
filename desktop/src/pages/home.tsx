import React, { FunctionComponent, useEffect, useState } from 'react';
import { Transaction } from '../model/transaction';
import { Account } from '../model/account';
import { Sidebar } from '../components/sidebar';
import { client } from '../util/axios';
import { accountFromDynamoDB, entryFromDynamoDB, transactionFromDynamoDB } from '../util/parser';
import { Entry } from '../model/entry';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { AddAccountModal } from '../components/addAccountModal';
import { Button } from '@material-ui/core';
import { TransactionTable } from '../components/transactionTable';
import { AddTransactionModal } from '../components/addTransactionModal';

export const HomePage: FunctionComponent = () => {
    const [addAccountModalVisibility, setAddAccountModalVisibilty] = useState<boolean>(false);
    const [addTransactionModalVisibility, setAddTransactionModalVisibility] = useState<boolean>(false);

    return (
        <div className="app">
            <div className="app__header">
                <h1 className="app__header__text">
                    Sage
                </h1>
                <Button onClick={() => setAddAccountModalVisibilty(true)}>A<SettingsOutlinedIcon /></Button>
                <Button onClick={() => setAddTransactionModalVisibility(true)}>T<SettingsOutlinedIcon /></Button>
            </div>
            <div className="app__content">
                <Sidebar />
                <div className="app__content__main">
                    <TransactionTable />
                </div>
            </div>
            <AddAccountModal
                visible={addAccountModalVisibility}
                setVisible={setAddAccountModalVisibilty}
            />
            <AddTransactionModal
                visible={addTransactionModalVisibility}
                setVisible={setAddTransactionModalVisibility}
            />
        </div>
    );
}

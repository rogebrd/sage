import React, { FunctionComponent, useState } from 'react';
import { Sidebar } from '../components/sidebar';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { AddAccountModal } from '../components/addAccountModal';
import { Button } from '@material-ui/core';
import { TransactionTable } from '../components/transactionTable';
import { useSageContext } from '../data/provider';

export const HomePage: FunctionComponent = () => {
    const { state } = useSageContext();
    const [addAccountModalVisibility, setAddAccountModalVisibilty] =
        useState<boolean>(false);

    return (
        <div className="app">
            <div className="app__header">
                <h1 className="app__header__text">Sage</h1>
                <p>Last Updated: {state.lastUpdated.toLocaleString()}</p>
                <Button onClick={() => setAddAccountModalVisibilty(true)}>
                    A<SettingsOutlinedIcon />
                </Button>
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
        </div>
    );
};

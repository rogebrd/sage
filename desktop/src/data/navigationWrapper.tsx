import React, { FunctionComponent } from 'react';
import { HomePage } from '../pages/home';
import { LoginPage } from '../pages/login';
import { useSageContext } from './provider';
import { NavigationState } from './state';

export const NavigationWrapper: FunctionComponent = () => {
    const { state } = useSageContext();

    return (
        <>
            {state.navigationState === NavigationState.LOGIN ? (
                <LoginPage />
            ) : null}
            {state.navigationState === NavigationState.HOME ? (
                <HomePage />
            ) : null}
        </>
    );
};

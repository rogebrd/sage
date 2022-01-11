import React, { FunctionComponent, useEffect, useState } from 'react';
import './styles/App.scss';
import './styles/svg.scss';
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

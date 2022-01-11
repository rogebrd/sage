import { Button } from '@material-ui/core';
import { FunctionComponent, useEffect, useState } from 'react';
import { navigate } from '../data/actionCreators';
import { useSageContext } from '../data/provider';
import { NavigationState } from '../data/state';

export const LoginPage: FunctionComponent = () => {
    const { resourceManager, dispatch } = useSageContext();
    const [password, setPassword] = useState('');

    const login = () => {
        resourceManager.login(password);
        setPassword('');
    };

    useEffect(() => {
        if (resourceManager.authenticated) {
            dispatch(navigate(NavigationState.HOME));
        }
    }, []);

    return (
        <div className="app">
            <div className="app__header">
                <h1 className="app__header__text">
                    Sage
                </h1>
            </div>
            <div className="app__content">
                <div className="app__content__login">
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                    <Button onClick={login}>Login</Button>
                </div>
            </div>
        </div>
    )
}

import { createContext, FunctionComponent, useContext } from 'react';
import { SageActions } from './actions';
import { sageReducer } from './reducer';
import { ResourceManager } from './resourceManager';
import { createInitialState, SageState } from './state';
import { useEnhancedReducer } from './util';

export type Dispatch = (action: SageActions) => SageState;

interface SageContextContent {
    resourceManager: ResourceManager;
    state: SageState;
    dispatch: Dispatch;
}

const SageContext = createContext<SageContextContent | null>(null);

export const SageContextProvider: FunctionComponent = ({ children }) => {
    const [state, dispatch] = useEnhancedReducer(
        sageReducer,
        createInitialState()
    );
    const resourceManager = new ResourceManager(dispatch);

    const value = {
        resourceManager: resourceManager,
        state: state,
        dispatch: dispatch,
    };

    return (
        <SageContext.Provider value={value}>{children}</SageContext.Provider>
    );
};

export const useSageContext = (): SageContextContent => {
    const context = useContext(SageContext);
    if (context === null) {
        throw new Error(
            'SageContext must be used within a SageContextProvider'
        );
    }

    return context;
};

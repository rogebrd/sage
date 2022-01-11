import { useRef, useCallback, useReducer } from "react";
import { SageState } from "./state";

export const useEnhancedReducer = (
    reducer: any,
    initialState: SageState
) => {
    const latestState = useRef(initialState);
    const getState = useCallback(() => latestState.current, []);
    const [state, dispatch] = useReducer(
        (state: SageState, action: any) => (latestState.current = reducer(state, action)),
        initialState,
        undefined
    );
    return [state, dispatch, getState]
}
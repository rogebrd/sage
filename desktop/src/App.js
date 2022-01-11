import { NavigationWrapper } from './data/navigationWrapper';
import { SageContextProvider } from './data/provider';
import './styles/App.scss';
import './styles/svg.scss';

export const App = () => {
    return (
        <SageContextProvider>
            <NavigationWrapper />
        </SageContextProvider>
    );
};

export default App;

import { Sage } from './sage';
import { SageContextProvider } from './data/provider';
import './styles/App.scss';
import './styles/svg.scss';

export const App = () => {
  return (
    <SageContextProvider>
      <Sage />
    </SageContextProvider>
  );
}

export default App;

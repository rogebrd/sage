import { AccountTable } from './components/accountTable/accountTable';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Omni Financial Tracker</h1>
      <AccountTable accountName="hello world" />
    </div>
  );
}

export default App;

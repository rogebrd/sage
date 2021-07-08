import { AccountTable } from './components/accountTable';
import './styles/App.scss';
import { TransactionTable } from './components/transactionTable';
import { Header } from './components/base/header';
import { AddAccountModal } from './components/addAccountModal';

const accounts = [
  {
    id: 1,
    name: "Cash",
    balance: 100.0,
    type: "Cash"
  },
  {
    id: 2,
    name: "Amex",
    balance: 100.0,
    type: "Liability"
  },
  {
    id: 3,
    name: "Checking",
    balance: 200.0,
    type: "Cash"
  },
  {
    id: 4,
    name: "Savings",
    balance: 1000.0,
    type: "Cash"
  },
  {
    id: 5,
    name: "Robinhood",
    balance: 100.0,
    type: "Investment"
  },
];

const transactions = [
  {
    id: 1,
    date: new Date(),
    vendor: "Vendor 1",
    account: accounts[1],
    description: "Test Transaction",
    amount: 99.99
  },
  {
    id: 2,
    date: new Date(),
    vendor: "Vendor 2",
    account: accounts[0],
    description: "Test Transaction",
    amount: 99.99
  }
];

function App() {
  return (
    <div className="app">
      <div className="app__header">
        <h1 className="app__header__text">
          Sage Financial Tracker
        </h1>
      </div>
      <div className="app__content">
        <div className="app__content__sidebar">
          <Header text="Accounts" />
          <AccountTable accounts={accounts} />
          <AddAccountModal />
        </div>
        <div className="app__content__main">
          <Header text="Transactions" />
          <TransactionTable transactions={transactions} />
        </div>
      </div>
    </div >
  );
}

export default App;

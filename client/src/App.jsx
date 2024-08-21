import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [pubKey, setPubKey] = useState("");
  const [wallets, setWallets] = useState([]);

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        pubKey={pubKey}
        setPubKey={setPubKey}
        setWallets={setWallets}
      />
      <Transfer
        address={address}
        privateKey={privateKey}
        pubKey={pubKey}
        setBalance={setBalance}
        wallets={wallets}
      />
    </div>
  );
}

export default App;

import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { toHex } from "ethereum-cryptography/utils.js";

function Wallet({ address, setAddress, privateKey, setPrivateKey, pubKey, setPubKey, balance, setBalance, setWallets}) {

  async function newWallet() {
    // create public private key pair
    privateKey = toHex(secp256k1.utils.randomPrivateKey());
    pubKey = secp256k1.getPublicKey(privateKey);
    address = '0x' + toHex(keccak256(pubKey.slice(1)).slice(-20));
    pubKey = toHex(pubKey);
    balance = 100;

    setPrivateKey(privateKey);
    setPubKey(pubKey);
    setAddress(address);
    setBalance(balance);

    const { data } = await server.post(`wallet`, {
      address,
      balance,
    });

    setWallets(data.wallets);
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        <button type="button" onClick={newWallet}>Create Wallet</button>
      </label>

      <label>
        Wallet Address {address}
      </label>
      <label>
        Private Key {privateKey}
      </label>
      <label>
        Public Key {pubKey}
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;

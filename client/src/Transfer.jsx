import { useState } from "react";
import server from "./server";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1";

function Transfer({ address, privateKey, pubKey, setBalance, wallets }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const data = {
      amount: parseInt(sendAmount),
      recipient
    }
    let signature = signMessage(data, privateKey);
    signature = JSON.stringify(signature, (_, v) => (typeof v === "bigint") ? v.toString() : v);

    const tx = {
      sender: address,
      pubKey,
      data,
      signature,
    }

    try {
      const {
        data: { balance },
      } = await server.post(`send`, tx);

      setBalance(balance);
    } catch (ex) {
      console.log('ex: ', ex);
      console.log('ex: ', ex.response.data);
      alert(ex.response.data.message);
    }
  }

  function hashMessage(data) {
    const bytes = utf8ToBytes(JSON.stringify(data));

    return keccak256(bytes);
  }

  function signMessage(data, privateKey){
    const hash = hashMessage(data);

    return secp256k1.sign(hash, privateKey);
  }

  function updateRecipient(e) {
    setRecipient(e.target.value);
  }

  const TransferForm =   <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        Wallets: {wallets.length}
        <select value={recipient} onChange={updateRecipient}>{
          wallets.map(x =>
            <option key={x}>{x}</option> )
        }</select>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>

  if (address) {
    return TransferForm
  }

  return
}

export default Transfer;

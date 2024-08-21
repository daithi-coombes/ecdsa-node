const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const utils = require('./lib/utils');

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;

  res.send({ balance });
});

app.post("/wallet", (req, res) => {
  const { address, balance } = req.body;

  balances[address] = balance;
  res.status(201).send({message: "wallet created", wallets: Object.keys(balances)});
});

app.post("/send", (req, res) => {
  let tx = req.body;
  const { data: { amount }, data: { recipient } } = tx;

  if (balances[tx.sender] < tx.data.amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {

    tx.signature = JSON.parse(tx.signature, (_, v) => (typeof v === "string") ? BigInt(v) : v);

    const valid = utils.validateTransaction(tx);
    if (!valid) {
      return res.send({ msg: 'Verification failed' });
    }

    balances[tx.sender] -= amount;
    balances[recipient] += amount;

    res.send({ balance: balances[tx.sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

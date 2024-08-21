const { keccak256 } = require("ethereum-cryptography/keccak");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function validateTransaction(transaction) {
  const { data, pubKey, signature } = transaction
  const messageHash = hashMessage(data)
  const valid = secp256k1.verify(signature, messageHash, pubKey)

  return valid
}

function hashMessage(data) {
  const bytes = utf8ToBytes(JSON.stringify(data))

  return keccak256(bytes)
}

module.exports = {
  setInitialBalance,
  validateTransaction,
}
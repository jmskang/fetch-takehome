// helper function to convert store Map to HTTP response-friendly Object
const convertStoreToObject = (store, userId) => {
  return {
    balance: Object.fromEntries(store.get(userId).balance.entries()),
    transactions: store.get(userId).transactions,
  };
};

module.exports = { convertStoreToObject };

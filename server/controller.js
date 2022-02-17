const { convertStoreToObject } = require('../util/utilities');
let store = new Map();
/*
{
  1: {
    balance (Map): {
      "UNILEVER": 1000,
      "DANNON": 200,
    },
    transactions: [ array of transaction objects for user 1 ]
  },
  2: {
    balance (Map): {
      "MILLER COORS": 300,
    },
    transactions: [ array of transaction objects for user 2 ]
  }
}
*/

const getPoints = (userId) => {
  // Checking for valid inputs
  if (!Number(userId)) {
    throw new Error('Invalid User ID');
  }
  if (!store.get(+userId)) {
    throw new Error(`No record for user ${userId}`);
  }

  // Respond with user's point balances
  const userBalances = store.get(+userId).balance;
  return Object.fromEntries(userBalances.entries());
};

const getTransactions = (userId) => {
  if (!Number(userId)) {
    throw new Error('Invalid User ID');
  }
  if (!store.get(+userId)) {
    throw new Error(`No record for user ${userId}`);
  }

  const userTransactions = store.get(+userId).transactions;
  return userTransactions;
};

const addPoints = (userId, transaction) => {
  const { payer, points, timestamp } = transaction;

  // Checks for valid inputs
  if (!Number(userId) || isNaN(points) || isNaN(Date.parse(timestamp)) || points == 0) {
    throw new Error('Invalid Inputs');
  }
  // passed as string, need to convert to number
  userId = +userId;
  // check if user has a record in our store
  if (store.has(userId)) {
    const userTransactions = store.get(userId).transactions;
    const userBalance = store.get(userId).balance;
    // check if we are adding points

    if (points > 0) {
      // set payer's balance to 0 if it doesn't exist, prevents error when adding to undefined
      if (!userBalance.has(payer)) userBalance.set(payer, 0);

      userTransactions.push({ payer, points, timestamp });
      userBalance.set(payer, userBalance.get(payer) + points);
    } else {
      if (userBalance.has(payer) && userBalance.get(payer) + points >= 0) {
        userTransactions.push({ payer, points, timestamp });
        userBalance.set(payer, userBalance.get(payer) + points);
      } else {
        throw new Error(`Negative balance is not allowed, balance for ${payer}: ${userBalance.get(payer)}`);
      }
    }
    // user has no record in the store (user's first added transaction)
  } else {
    if (points < 0) {
      throw new Error(`Negative balance is not allowed, balance for ${payer}: 0`);
    }
    const balance = new Map();
    balance.set(payer, points);
    store.set(userId, { balance, transactions: [{ payer, points, timestamp }] });
  }

  // sort transactions so that oldest transactions are at the beginning
  store.get(userId).transactions.sort((a, b) => {
    return Date.parse(a.timestamp) > Date.parse(b.timestamp) ? 1 : -1;
  });

  const responseObject = convertStoreToObject(store, userId);
  return responseObject;
};

const spendPoints = (userId, pointsToSpend) => {
  // validations
  if (!Number(userId) || isNaN(pointsToSpend) || pointsToSpend == 0) {
    throw new Error('Invalid Inputs');
  }
  userId = +userId;
  if (!store.has(userId)) {
    throw new Error('User not found');
  }
  const userStore = store.get(userId);
  // Check if user has enough points to begin with
  let usersAvailablePoints = 0;
  const userBalance = userStore.balance;
  userBalance.forEach((value) => {
    usersAvailablePoints += value;
  });
  if (pointsToSpend > usersAvailablePoints) {
    throw new Error(`Not enough points. Available Points: ${usersAvailablePoints}`);
  }

  let listOfPayers = new Map();
  const userTransactions = userStore.transactions;
  // points logic
  for (let transaction of userTransactions) {
    if (pointsToSpend === 0) break;
    if (transaction.spent === true) continue;

    let payer = transaction.payer;
    let transactionPoints = transaction.points;

    if (transactionPoints < 0) {
      pointsToSpend -= transactionPoints;
      if (listOfPayers.has(payer)) {
        listOfPayers.set(payer, listOfPayers.get(payer) - transactionPoints);
      }
    } else {
      if (pointsToSpend - transactionPoints > 0) {
        userTransactions.push({
          payer,
          points: -transactionPoints,
          timestamp: new Date().toISOString(),
        });
        listOfPayers.set(
          payer,
          listOfPayers.has(payer) ? listOfPayers.get(payer) - transactionPoints : -transactionPoints
        );
        pointsToSpend -= transactionPoints;
      } else {
        userTransactions.push({
          payer,
          points: -pointsToSpend,
          timestamp: new Date().toISOString(),
        });
        listOfPayers.set(payer, -pointsToSpend);
        pointsToSpend = 0;
      }
    }
    transaction.spent = true;
  }

  listOfPayers.forEach((value, key) => {
    userBalance.set(key, userBalance.get(key) + value);
  });

  return Object.fromEntries(listOfPayers.entries());
};

module.exports = { getPoints, addPoints, spendPoints, getTransactions };

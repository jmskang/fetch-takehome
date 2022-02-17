# Fetch Rewards Take Home Assessment (Back end)
Fetch Rewards Take Home Coding Assessment by James Kang

This assessment was built with Node.js and Express. 
## Setup

- Download or clone this repository and then navigate to the folder in your terminal of choice. 
- From your terminal, navigate to the project folder and run the following commands
```bash
npm install
npm run start
```
- This will install the necessary dependencies and start the server on localhost port 3000 (Port can be changed in server/index.js if required)
- Postman, Insomnia, or any other API testing platform can be used to send HTTP requests to the server or directly through the terminal with the curl command.
## Usage

This API consists of 4 endpoints : 
- GET /points/:userId 
  - Returns the reward point balances for a user by numeric user id
- GET /points/transactions/:userId
  - Returns a list of all points transactions for a user by numeric user id
- POST /points/add/:userId
  - Adds a reward point transaction for a user by numeric user id and returns the user's point balance and transactions
  - Accepts JSON data in the format of 
 ``` 
{ 
   "payer": "PAYER NAME HERE",  
   "points": NUMBER HERE,  
   "timestamp": "YYYY-MM-DDTHH24:MM:SSZ"  
}
```
- POST /points/spend/:userId
  - Attempts to spend reward points for a user by numeric user id and returns a list of payer's and their deductions
  - Accepts JSON data in the format of 
```
{ 
  "points": NUMBER HERE  
}
```

# Mongo-Express-JWT-Boilerplate

simple minimal boilerplate project for projects using Mongo, express and JWT auth.

## Libraries 

- **mongoose** - for database interactions, read, writes, models etc...
- **joi** - for request validations.
- **jasonwebtoken** - for token creation and validation.
- **nodemon** - for easy development, automatic server restart on file updates.
- **dotenv** - for storing sensitiv data and project variables.
- **cors** - for CORS setup, easy rules to protect your API

## Installation

-clone repository

then, withing the project folder use npm to install dependencies
```bash
npm install
```

copy .env-example and rename as .env and update with your mongo URI and app secret(anything works but change it!)

for development use 
```bash
npm run dev
```

## Usage

**GET - localhost:5000/api/welcome** 

this is just a test to validate the server is up and running
 
**POST - localhost:5000/api/auth/register** 

expects email and password

**POST - localhost:5000/api/auth/login** 

expects email and password, returns JWT
 


## License
[MIT](https://choosealicense.com/licenses/mit/)

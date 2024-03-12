# Desa Manud App

## Getting Started

### Prerequisites

What things you need to install the software and how to install them

```
-NodeJS & NPM (Windows: https://phoenixnap.com/kb/install-node-js-npm-on-windows)
* For NodeJS, recommended to install via NVM (Node Version Manager), but the basic one is okay too, just use the latest
-Docker (Windows: https://docs.docker.com/desktop/install/windows-install/)
-Mongodb DB manager (MongoDB compass / DBeaver)
```

### Installing

How to run this application is on local
```
1. Clone this repo to your local
2. Rename the the docker.compose.yml to docker-compose-server.yml and docker-compose-local.yml to docker-compose.yml
3. Run docker compose up -d to run the docker (To run the mongodb server)
4. Check on mongodb DB manager to check whether the database already running or no. Connect to `mongodb://dtpl-db:DTPLdb-2o24@localhost:27017/``
5. Then, on app, create .env file, and fill the file with -> `BE_BASEURL=http://localhost:3001``
6. Then, on server, create .env file too and fill the file with -> 
`PORT=3001
MONGO_URI=mongodb://dtpl-db:DTPLdb-2o24@localhost:27017
MONGO_DB_NAME=desa-manud
JWT_SECRET=DTPLtask@2024!`
7. Open terminal (CMD) on the app folder, then do npm install, and run it with npm run dev
8. Open another terminal on server folder, to the npm install also and run the server with npm run dev
9. The server will running on localhost:3001 and the frontend will be on localhost:3000

Note: 
To login, use : 
username : testinguser@test.com
password : abc123

Or you can just signup as new user
```

## Running the tests

To test the API, you can use my postman collection, will shared separately due to security issue if shared in here

First thing to do, try to hit the register endpoint with this body
`{
    "username": "superadmin",
    "email": "superadmin@desamanud.com",
    "userFullName": "Super Admin",
    "password": "DTPLdb-2o24",
    "role": "superAdmin"
}`

## Built With

* [ExpressJS](https://expressjs.com/) - The backend framework used
* [NextJS](https://nextjs.org/) - The frontend framework used


## Authors

* **Egriano Aristianto**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

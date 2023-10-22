# Project Description
This one is a stock market project that helps find valuable stocks to invest in for profitable trades based on price and volume data.

# Details of the Components

* The Client part was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
* The Server is a Node JS Application
* Usage SqLite for user account data storage

# Prequisites
* Node JS

# Getting the frontend ready

* go inside the client directory
* rename '.env.example' to '.env'
* modify .env file according to needs
* run 'npm install'
* run 'npm run build'

# Getting the backend ready
* go inside the server directory
* rename '.env.example' to '.env'
* modify the '.env' file as required
* run 'npm install'
* run 'npx sequelize-cli db:migrate'
* run 'node app.js'

# Running
* open the application in your browser with an address something like this: "http://localhost:3333"
* click signup and create a test account
* login using the username and password

# Modifying the frontend
* open the client directory in VSCode
* run 'npm start'
* add/remove/edit compoents, pages, routes etc.
* create production build using 'npm run build'

# Modifying the backend
* open the server directory in VSCode
* create new APIs in the 'apis' directory
* register the apis in the 'app.js' file
* run 'node app.js'

# Deployment
* build the client by running the command 'npm run build' in the client directory
* in the server directory run 'node app.js'

# Database File Location
* The database (sqlite.db) is stored in the same directory as the 'client' and 'server' directories
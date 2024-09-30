const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const app = express()

// Middleware to parse incoming JSON requests
app.use(express.json())

// Serve static files (like index.css) from the current directory
app.use(express.static(path.join(__dirname)))

// Serve the HTML form at the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

let database = null

// Initialize the database and server
const initializeDbAndServer = async () => {
  try {
    // Open the SQLite database
    database = await open({
      filename: path.join(__dirname, 'userAddressApp.db'),
      driver: sqlite3.Database,
    })

    // Create the tables
    await createTables()

    // Start the server
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (error) {
    console.error(`DB Error: ${error.message}`)
    process.exit(1)
  }
}

// Function to create User and Address tables
const createTables = async () => {
  const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS User (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
  `

  const createAddressTableQuery = `
    CREATE TABLE IF NOT EXISTS Address (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      address TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES User(id)
    );
  `

  await database.exec(createUserTableQuery)
  await database.exec(createAddressTableQuery)
}

// POST endpoint to handle form submission and store user info
app.post('/register', async (req, res) => {
  const {name, address} = req.body

  try {
    // Insert the new user into the User table
    const createUserQuery = `
      INSERT INTO User (name)
      VALUES ('${name}');
    `
    const userResult = await database.run(createUserQuery)
    const userId = userResult.lastID

    // Insert the address into the Address table
    const createAddressQuery = `
      INSERT INTO Address (userId, address)
      VALUES (${userId}, '${address}');
    `
    await database.run(createAddressQuery)

    res.status(201).send('User and Address successfully added')
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`)
  }
})

// GET endpoint to retrieve all users and their addresses
app.get('/users', async (req, res) => {
  const getUsersQuery = `
    SELECT User.id, User.name, Address.address
    FROM User
    JOIN Address ON User.id = Address.userId;
  `

  try {
    const users = await database.all(getUsersQuery)
    res.send(users)
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`)
  }
})

app.delete('/delete-all', async (req, res) => {
  try {
    // First, delete all addresses
    const deleteAddressQuery = `
      DELETE FROM Address;
    `
    await database.run(deleteAddressQuery)

    // Then, delete all users
    const deleteUserQuery = `
      DELETE FROM User;
    `
    await database.run(deleteUserQuery)

    res.status(200).send('All users and addresses successfully deleted')
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`)
  }
})

// Initialize the database and start the server
initializeDbAndServer()

module.exports = app

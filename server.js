const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb')
const { isInvalidEmail, isEmptyPayload } = require('./validator')

// const DB_USER = process.env.DB_USER
// const DB_PASS = process.env.DB_PASS
const { DB_USER, DB_PASS, DEV } = process.env

// if (DEV) {
//     const url = 'mongodb://127.0.0.1:27017'
// } else {
//     const url = `mongodb://${DB_USER}:${DB_PASS}@127.0.0.1:27017?authSource=company_db`
// }

const dbAddress = '127.0.0.1:27017'
const url = DEV ? `mongodb://${dbAddress}` : `mongodb://${DB_USER}:${DB_PASS}@${dbAddress}?authSource=company_db`

// create a new client that can talk to the Mongo server on the URL we provided above
const client = new MongoClient(url)
const dbName = 'company_db'
const collName = 'employees'

app.use(bodyParser.json())
app.use('/', express.static(__dirname + '/dist'))

app.get('/get-profile', async function(req, res) {
    // connect to db
    await client.connect()
    console.log('Connected successfully to server')

    // initiate or get the db & collection
    const db = client.db(dbName)
    const collection = db.collection(collName)

    // get data from db
    const result = await collection.findOne({ id: 1})
    console.log(result)
    client.close()

    response = {}
    if (result !== null) {
        response = {
            name: result.name,
            email: result.email,
            interests: result.interests
        }
    }

    res.send(response)
})

// '/update-profile' is a Handler
app.post('/update-profile', async function(req, res) {
    const payload = req.body
    console.log(payload)

    if (isEmptyPayload(payload) || isInvalidEmail(payload)) {
        res.send({error: "Invalid payload. Couldn't update user profile"})
    } else {
        // connect to mongodb
        await client.connect()
        console.log('Connected successfully to server')

        // initiate or get the db & collection
        const db = client.db(dbName)
        const collection = db.collection(collName)

        // save payload data to db
        payload['id'] = 1
        const updatedValues = { $set: payload}
        // await collection.insertOne(payload)
        await collection.updateOne({id: 1}, updatedValues, {upsert: true})
        client.close()

        res.send({info: "user profile data updated successfully"})
    }
})

const server = app.listen(3000, function() {
    console.log("app listening on port 3000")
})

module.exports = {
    app,
    server
}    
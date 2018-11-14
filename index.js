const express = require('express')
const app = express()
const handler = require('./src/handle').handler

app.use('/graphql', handler)

const PORT = process.env.PORT || 4000

app.listen(4000, () => console.log(`app listening on port ${PORT}`))
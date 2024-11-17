import express from 'express'
// import client from '@meta/db/client'
const app = express()

// app.use
const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`websocket running on port: ${PORT}`)
})
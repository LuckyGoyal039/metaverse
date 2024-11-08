import express from 'express'
import client from "@meta/db/client"
import router from './routes/v1'
const app = express()

express.json()
app.use("api/v1",router)

app.listen(3000, () => {
    console.log("http server running on port 3000")
})
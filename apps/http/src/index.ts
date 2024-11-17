import express from 'express'
import client from "@meta/db/client"
import router from './routes/v1'
import dotenv from 'dotenv'
import cors from 'cors';
dotenv.config();
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`http server running on port ${PORT}`)
})
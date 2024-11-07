import express from 'express'

const app = express()

app.use("api/v1")

app.listen(3000, () => {
    console.log("http server running on port 3000")
})
import 'dotenv/config'
import express from "express"
import bootstrap from "./src/app.controller.js"

const app = express()
const port = 3000

app.listen(port, () => console.log(`http://localhost:${port}`))

bootstrap(express , app)
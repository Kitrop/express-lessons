import express from "express"
import cookieParser from "cookie-parser"
import cors from 'cors'
import authRouter from "../routes/authRouter"
import bodyParser from "body-parser";

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(bodyParser())


// Подключаем роуты
app.use('/api', authRouter)

export default app
import app from "./config/config"
import {connect, ConnectOptions} from 'mongoose'
import dotenv from "dotenv";

dotenv.config()
const port = process.env.PORT || 5000


const run = async () => {
    try {
        await connect(process.env.DB_URI, {
            useNewUrlParser: true,
        } as ConnectOptions)
        app.listen(port, () => {
            console.log(`server started on port ${port}`)
        })
    } catch (e) {
        console.log(e)
    }
}

run()


import {createTransport} from "nodemailer";
import dotenv from "dotenv";

dotenv.config()


const transporter = createTransport({
    // @ts-ignore
    host: process.env.HOST_MAIL,
    port: process.env.PORT_MAIL,
    secure: true,
    auth: {
        user: process.env.ADDRESS_MAIL,
        pass: process.env.PASSWORD_MAIL
    }
})

const mailService = {
    async sendActivationLink(to: string, link: string) {
        const info = await transporter.sendMail({
            from: 'steamguardemail@yandex.ru',
            to,
            subject: "Confirm registration",
            text: "",
            html: `<div><h1>Confirm registration</h1> <a href=${link}>${link}</a></div>`
        })
    }
}
export default mailService
import {sign} from "jsonwebtoken";
import dotenv from "dotenv";
import {TokenModel} from "../modules/tokenModel";

dotenv.config()

const tokenService = {
    // Создание токена
    generateToken(payload) {
        const accessToken = sign(payload, process.env.SECRET_KEY_ACCESS, {expiresIn: '30m'})
        const refreshToken = sign(payload, process.env.SECRET_KEY_REFRESH, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    },
    // Сохранение токена
    async saveToken(_id: string, refreshToken: string) {
        // Находим есть ли у пользователя refreshToken
        const tokenData = await TokenModel.findOne({_id})
        // Если есть перезаписываем его
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await TokenModel.create({
            _id,
            refreshToken
        })
        return token
    }
}

export default tokenService
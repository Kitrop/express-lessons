import {sign, verify} from "jsonwebtoken";
import dotenv from "dotenv";
import {TokenModel} from "../modules/tokenModel";

dotenv.config()

const tokenService = {
    // Создание токена
    generateToken(payload) {
        const accessToken = sign(payload, process.env.SECRET_KEY_ACCESS, {expiresIn: '30s'})
        const refreshToken = sign(payload, process.env.SECRET_KEY_REFRESH, {expiresIn: '30d'})
        return {accessToken, refreshToken}
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
        return await TokenModel.create({_id, refreshToken})
    },
    async removeToken(refreshToken: string) {
        return await TokenModel.deleteOne({refreshToken})
    },
    validateRefreshToken(refreshToken: string) {
        try {
            const data = verify(refreshToken, '1O8STjXh1nuKAqPRhtdOCwKOubQdyH0a')
            console.log('Verify data: ' + data)
            return data
        } catch (e) {
            return null
        }
    },
    validateAccessToken(accessToken) {
        try {
            return verify(accessToken, process.env.SECRET_KEY_ACCESS)
        } catch (e) {
            return null
        }
    },
    async findToken(token: string) {
        return await TokenModel.findOne({refreshToken: token})
    }
}

export default tokenService
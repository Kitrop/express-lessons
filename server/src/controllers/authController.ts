import {NextFunction, Request, Response} from "express"
import usersService from "../services/usersService";
import {compare} from "bcrypt";
import tokenService from "../services/tokenService";
import {TokenModel} from "../modules/tokenModel";

export const authController = {
    async registration(email: string, password: string) {
        // Отправляем email и password для регистрации пользователя
        return await usersService.registration(email, password)
    },
    async login(email: string, password: string) {
        // Находим пользователя по email
        const user = await usersService.login(email)
        // Если пользователь существует
        if (user) {
            // Сравниваем хэшированый пароль и пароль пользователя
            const checkPass = await compare(password, user.password)
            // Если пароли совпадают
            if (checkPass) {

                // Генерируем токены, добавляя payload
                const tokens = tokenService.generateToken({
                    _id: user._id,
                    email: user.email,
                    isActivated: user.isActivated
                })

                // Сохраняем токены в БД
                await tokenService.saveToken(user._id.toString(), tokens.refreshToken)

                return {
                    data: {
                        ...tokens,
                        email: user.email,
                        _id: user._id,
                    }, status: 200
                }
            }

            // Если пароли не совпадают
            else return {data: 'Incorrect password', status: 401}
        }

        // Если пользователя не существует
        else return {data: 'No User with this email', status: 404}
    },
    async activate(link: string) {
        return await usersService.activation(link)
    },
    async refresh(refreshToken: string) {

    },
    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            res.json('6')
        } catch (e) {
            console.log(e)
        }
    },
}
import {UserModel} from "../modules/userModel"
import {hash} from "bcrypt"
import {v4} from "uuid"
import mailService from "./mailService"
import tokenService from "./tokenService";

const usersService = {
    async registration(email: string, password: string) {
        // Проверяем есть ли юзер с таким email
        const candidate = await UserModel.findOne({email})

        // Если нет пользователя с таким email
        if (!candidate) {
            // хэшируем пароль
            const hashPassword = await hash(password, 5)

            // Создаем ссылку для активации аккаунта
            const activationLink = v4()

            // Создаем пользователя
            const user = await UserModel.create({email, password: hashPassword, activationLink})

            // Высылаем на указанный email письмо с активацией
            await mailService.sendActivationLink(email, `localhost:5000/api/activate/${activationLink}`)

            // Заносим основные данные о пользователе в переменную
            const userMainInfo = {
                _id: user._id,
                email: user.email,
                isActivated: user.isActivated
            }

            // Создаем токены
            const tokens = tokenService.generateToken({
                userMainInfo
            })

            // Сохраняем рефреш токен в БД
            await tokenService.saveToken(user._id.toString(), tokens.refreshToken)

            return {
                data: {
                    ...tokens,
                    user: userMainInfo
                },
                status: 201
            }
        } else {
            return {
                data: `Пользователь с почтовым адресом ${email} уже есть`,
                status: 400
            }
        }

    }
}

export default usersService
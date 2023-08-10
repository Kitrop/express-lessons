import {UserModel} from "../modules/userModel"
import {hash} from "bcrypt"
import {v4} from "uuid"
import mailService from "./mailService"
import tokenService from "./tokenService";
import dotenv from "dotenv";

dotenv.config()

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

    },
    async login(email: string) {
        return await UserModel.findOne({email})
    },
    async activation(link: string) {
        const candidate = await UserModel.findOne({activationLink: link})
        if (candidate) {
            if (candidate.isActivated === true) {
                return {
                    data: 'This account has already been activated',
                    status: 400
                }
            }
            candidate.isActivated = true
            candidate.save()
            return {
                data: {
                    _id: candidate._id,
                    email: candidate.email,
                    isActivated: candidate.isActivated,
                },
                status: 200
            }
        }
        else {
            return {
                data: 'Incorrect link',
                status: 404
            }
        }
    },
    async logout(refreshToken: string) {
        const token = await tokenService.removeToken(refreshToken)
        if (token.deletedCount !== 0) {
            return {
                data: 'Access logout',
                status: 204
            }
        } else {
            return {
                data: 'Error logout',
                status: 400
            }
        }
    },
    async refresh(refreshToken: string) {
        // Если токен пустой
        if (!refreshToken) {
            return {data: 'No token', status: 400}
        }
        // Проверяем что токен не подделан
        const validationData = await tokenService.validateRefreshToken(refreshToken)
        // Ищем устаревший токен в БД
        const tokenFromDb = await tokenService.findToken(refreshToken)

        // Если с токена не существует
        if (!validationData || !tokenFromDb) {
            return {data: 'Unauthorized user', status: 401}
        }

        // @ts-ignore
        // Находим пользователя по id из токена
        const userData = await UserModel.findOne({_id: validationData._id})

        // Генерируем токены, добавляя payload
        const tokens = tokenService.generateToken({
            _id: userData._id,
            email: userData.email,
            isActivated: userData.isActivated
        })

        // Сохраняем токены в БД
        await tokenService.saveToken(userData._id.toString(), tokens.refreshToken)
        return {
            data: {
                ...tokens,
                email: userData.email,
                _id: userData._id,
            }, status: 200
        }
    },
    async getAllUsers() {
        // Находим всех пользователей
        const usersData = await UserModel.find()
        // Если произошла какая-либо ошибка
        if (!usersData) {
            return {
                data: 'Error',
                status: 400
            }
        }
        // Возращаем только публичные данные
        const data = usersData.map(u => {
            return {
                _id: u._id,
                email: u.email,
                isActivated: u.isActivated,
            }
        })
        return {
            data,
            status: 200
        };
    }

}

export default usersService
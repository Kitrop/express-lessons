import {Response, Router, Request} from "express";
import {authController} from "../controllers/authController"
import {checkLink, checkEmail, checkPassword} from "../middlewares/authMiddlewares";
import {validationResult} from "express-validator";
import usersService from "../services/usersService";

const authRouter = Router()

authRouter
    // Регистрация
    .post('/registration', checkEmail, checkPassword, async (req: Request, res: Response) => {
        const result = validationResult(req)
        if (result.isEmpty()) {
            // Отправляем данные для регистрации пользователя
            const response = await authController.registration(req.body.email, req.body.password)
            // Если регистрация прошла успешно
            if (response.status === 201) {
                // @ts-ignore
                // Сохраняем в куки refreshToken
                res.cookie('refreshToken', response.data.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true
                })
            }
            res.json(response.data).status(response.status)
        } else res.status(400).json({errors: result.array()})
    })

    // Вход пользователя
    .post('/login', checkEmail, checkPassword, async (req: Request, res: Response) => {
        const result = validationResult(req)
        if (result.isEmpty()) {

            // Для входа передаем email и password пользователя
            const response: any = await authController.login(req.body.email, req.body.password)

            // Если все прошло успешно
            if (response.status === 200) {
                // Добавляем refreshToken в куки
                res.cookie('refreshToken', response.data.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true
                })
                res.json({
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                    email: response.data.email,
                    _id: response.data._id
                }).status(response.status)
            }
            // Если вход прошел неуспешно
            else res.json(response.data).status(response.status)
        } else res.status(400).json({errors: result.array()})
    })

    // Выход из аккаунта
    .post('/logout', async (req: Request, res: Response) => {
        const {refreshToken} = req.cookies
        const response = await usersService.logout(refreshToken)
        if (response.status === 204) {
            res.clearCookie('refreshToken')
        }
        res.json(response.data).status(response.status)
    })

    // Активация аккаунта
    .get('/activate/:link?', checkLink, async (req: Request, res: Response) => {
        const result = validationResult(req)
        if (result.isEmpty()) {
            const response = await authController.activate(req.params.link)
            res.json(response.data).status(response.status)
        } else {
            res.status(400).json({errors: result.array()})
        }
    })

    // Обновление токена
    .get('/refresh', async (req: Request, res: Response) =>{
        const {refreshToken} = req.cookies
        // Отправляем устаревший refreshToken, чтобы получить новый
        const response = await usersService.refresh(refreshToken)
        console.log('TOKEN: ' + refreshToken)
        // @ts-ignore
        // Сохраняем новый refreshToken
        res.cookie('refreshToken', response.data.refreshToken)
        res.json(response.data).status(response.status)
    })

    // Полученме пользователей
    .get('/users', authController.getUsers)


export default authRouter
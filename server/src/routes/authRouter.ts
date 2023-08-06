import {Response, Router, Request} from "express";
import {authController} from "../controllers/authController"
import {checkEmail, checkPassword} from "../middlewares/authMiddlewares";
import {validationResult} from "express-validator";

const authRouter = Router()

authRouter
    .post('/registration', checkEmail, checkPassword, async (req: Request, res: Response) => {
        const result = validationResult(req)
        if (result.isEmpty()) {
            const response = await authController.registration(req.body.email, req.body.password)
            if (response.status === 201) {
                // @ts-ignore
                res.cookie('refreshToken', response.data.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            }
            res.json(response.data).status(response.status)
        }
        else {
            res.status(400).json({errors: result.array()})
        }
    })
    .post('/login', authController.login)
    .post('/logout', authController.logout)
    .get('/activate/:link', authController.activate)
    .get('/refresh', authController.refresh)
    .get('/users', authController.getUsers)

export default authRouter
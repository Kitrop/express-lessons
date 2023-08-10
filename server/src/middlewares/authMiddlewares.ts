import {body, param} from "express-validator";
import {NextFunction} from "express";
import tokenService from "../services/tokenService";

export const checkEmail = body('email').isEmail().withMessage('Invalid email address. You didn\'t enter an email').escape()
export const checkPassword = body('password').isStrongPassword().withMessage('Your password is not strong').escape()
export const checkLink = param('link').notEmpty().withMessage('Link is empty').escape()


export const authMiddleware = async (req, res, next: NextFunction) => {
    try {
        const authToken = req.header('authorization')
        if (!authToken) {
            return res.json('No token in header').status(400)
        }
        const accessToken = authToken.split(' ')[1]
        if (!accessToken) {
            return res.json('No token').status(400)
        }
        const tokenData = tokenService.validateAccessToken(accessToken)
        if (!tokenData) {
            return res.json('Invalid token').status(400)
        }
        req.user = tokenData
        next()
    } catch (e) {
        return res.json('Unknown error').status(400)
    }
}
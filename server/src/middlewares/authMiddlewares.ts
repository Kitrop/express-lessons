import {body} from "express-validator";

export const checkEmail= body('email').isEmail().withMessage('Invalid email address. You didn\'t enter an email').escape()
export const checkPassword = body('password').isStrongPassword().withMessage('Your password is not strong').escape()
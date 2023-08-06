import {NextFunction, Request, Response} from "express"
import usersService from "../services/usersService";

export const authController = {
    async registration(email: string, password: string) {
        try {
            const userData = await usersService.registration(email, password)
            return userData
        } catch (e) {
            console.log(e)
        }
    },
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            res.json('2')
        } catch (e) {
            console.log(e)
        }
    },
    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            res.json('3')
        } catch (e) {
            console.log(e)
        }
    },
    async activate(req: Request, res: Response, next: NextFunction) {
        try {
            res.json('4')
        } catch (e) {
            console.log(e)
        }
    },
    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            res.json('5')
        } catch (e) {
            console.log(e)
        }
    },
    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            res.json('6')
        } catch (e) {
            console.log(e)
        }
    },
}
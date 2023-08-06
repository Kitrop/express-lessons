import {model, Schema} from "mongoose";
import {IUserSchema} from "../utils/types";

const UserModelSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String}
})

export const UserModel = model<IUserSchema>('UserModel', UserModelSchema)
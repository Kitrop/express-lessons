import {model, Schema} from "mongoose";

const TokenModelSchema = new Schema({
    _id: {type: Schema.Types.ObjectId, ref: 'UserModel'},
    refreshToken: {type: String, required: true}
})

export const TokenModel = model('TokenModel', TokenModelSchema)
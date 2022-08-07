import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: {type:String, required: true, unique: true},
  role: {type:String, enum:['admin','employee'], required: true},
});
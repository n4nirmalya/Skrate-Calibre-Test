import * as mongoose from 'mongoose';

export const TicketSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {type:String,enum:['open','close'],default:'open'},
  priority: {type:String,enum:['low','medium','high'],default:'low'},
  assignedTo: String,
  createdAt: { type: Date, default: Date.now },
});
import { Document } from 'mongoose';

export interface Ticket extends Document {
  readonly title: string;
  readonly description: string;
  readonly status: string;
  readonly priority: string;
  readonly assignedTo:  string;
  readonly createdAt: Date;
}
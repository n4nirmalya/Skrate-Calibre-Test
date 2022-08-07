import { Connection } from 'mongoose';
import { TicketSchema } from '../shared/database/schemas/ticket.schema';

export const ticketProviders = [
  {
    provide: 'TICKET_MODEL',//TODO:move to constant
    useFactory: (connection: Connection) => connection.model('Ticket', TicketSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
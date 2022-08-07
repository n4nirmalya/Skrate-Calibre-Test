import { Connection } from 'mongoose';
import { UserSchema } from '../shared/database/schemas/user.schema';

export const userProviders = [
  {
    provide: 'USER_MODEL',//TODO:move to constant
    useFactory: (connection: Connection) => connection.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
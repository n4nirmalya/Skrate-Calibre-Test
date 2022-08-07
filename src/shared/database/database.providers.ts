import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect("mongodb+srv://nothing:YcFnfL9aNKpTkrE1@cluster0.zea0le8.mongodb.net/?retryWrites=true&w=majority"),
  },
];

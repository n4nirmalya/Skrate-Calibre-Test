import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { ticketProviders } from './ticket.providers';
import { DatabaseModule } from '../shared/database/database.module';
import { AuthModule } from 'src/shared/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [DatabaseModule,AuthModule,UserModule],
  controllers: [TicketController],
  providers: [
    TicketService,
    ...ticketProviders,
  ],
})
export class TicketModule {}
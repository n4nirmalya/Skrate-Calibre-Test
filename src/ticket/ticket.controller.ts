import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CreateTicketDto } from './dto/create-Ticket.dto';
import { FindByPriorityDto, FindByStatusDto, FindByTitleDto } from './dto/find-Ticket.dto';
import { TicketService } from './ticket.service';
import {Response, Request} from 'express'
import { ROLE } from 'src/shared/constant/enum';
import { CloseTicketDto } from './dto/close-Ticket.dto';
import { DeleteTicketDto } from './dto/delete-Ticket.dto';


@Controller('tickets')
export class TicketController {
    constructor(private ticketService: TicketService) {}

    @UseGuards(JwtAuthGuard)
    @Post('new')
    async create(@Body() createTicketDTO: CreateTicketDto,@Res() res: Response, @Req() req: Request) {
        const user:any = req.user;
        if(user.role === ROLE.ADMIN){
            const ticket:any =  await this.ticketService.create(createTicketDTO);
            res.status(ticket.statusCode)
            return res.send(ticket.data)
        }
        res.status(400)
        return res.json({message:"unauthorized"})
    }

    @Get('all')
    async findAll(@Res() res: Response, @Req() req: Request) {
        const tickets = await this.ticketService.findAll();
        res.status(tickets.statusCode)
        return res.send(tickets.data)
    }
    @Get()
    async find(@Query() findTicketQuery:FindByPriorityDto | FindByStatusDto | FindByTitleDto,@Res() res: Response, @Req() req: Request){
        const ticket = await this.ticketService.findByQuery(findTicketQuery)
        res.status(ticket.statusCode)
        return res.send(ticket.data)
    }

    @UseGuards(JwtAuthGuard)
    @Post('markAsClosed')
    async close(@Body() closeTicketDto: CloseTicketDto,@Res() res: Response, @Req() req: Request) {
        const user:any = req.user;
        const ticket:any =  await this.ticketService.update(closeTicketDto,user);
        res.status(ticket.statusCode)
        res.json(ticket.data)
    }
    @UseGuards(JwtAuthGuard)
    @Post('delete')
    async delete(@Body() deleteTicketDto: DeleteTicketDto,@Res() res: Response, @Req() req: Request) {
        const user:any = req.user;
        if(user.role === ROLE.ADMIN){
            await this.ticketService.delete(deleteTicketDto);
            return res.json({message:"deleted"})
        }
        res.status(400)
        return res.json({message:"unauthorized"})
    }

}

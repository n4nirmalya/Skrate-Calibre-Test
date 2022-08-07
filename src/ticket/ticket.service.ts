import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-Ticket.dto';
import { CloseTicketDto } from './dto/close-Ticket.dto';
import { DeleteTicketDto } from './dto/delete-Ticket.dto';
import { Ticket } from './interfaces/ticket.interface';
import { FindById, FindByPriorityDto, FindByStatusDto, FindByTitleDto } from './dto/find-Ticket.dto';
import { UserService } from 'src/user/user.service';
import { ROLE } from 'src/shared/constant/enum';

@Injectable()
export class TicketService {
  constructor(
    @Inject('TICKET_MODEL')
    private TicketModel: Model<Ticket>,
    private userService:UserService
  ) {}

  async create(createTicketDto: CreateTicketDto){
    return new Promise(async (resolve,reject) => {
      try {
        const assignedTo = await this.userService.findRandomUser()
        const createdTicket = new this.TicketModel({ assignedTo, ...createTicketDto });
        const ticket: Ticket = await createdTicket.save();
        resolve({statusCode:200,data:{ticketId: ticket._id} })
      } catch (error) {
        resolve({statusCode:500,data:{message:error?.message || "server error"}})
      }
    })
  }

  async findAll(): Promise<any> {
    try {
      const tickets = await this.TicketModel.find().exec();
      return {statusCode:200,data:{tickets}}
    } catch (error) {
      return { statusCode: 500, data: { message:error?.message || 'server error' } }
    }
  }

  async findByQuery(query:FindByPriorityDto | FindByStatusDto | FindByTitleDto | FindById): Promise<any> {
    try {
      const tickets = await this.TicketModel.find(query).exec();
      return { statusCode: 200, data: { tickets } }
    } catch (error) {
      return { statusCode: 500, data: { message: error?.message || 'server error' } }
    }
  }

  async update(closeTicketDto:CloseTicketDto,user:any):Promise<any>{
    const ticket = await this.TicketModel.findOne({_id:closeTicketDto.ticketId})
    if(user.role === ROLE.ADMIN || user.username === ticket.assignedTo){
      const ticketPriority = this.getPriority(ticket.priority)
      console.log('ticketPriority', ticketPriority)
      const priorityJobs = await this.TicketModel.find({
        priority:ticketPriority,
        _id:{$ne:closeTicketDto.ticketId},
        assignedTo:ticket.assignedTo,
        status:{$ne:"close"}
      })
      if(priorityJobs.length){
        return{
          statusCode:403,
          data:{
            tickets:priorityJobs,
            message:"A higher priority task remains to be closed"
          }
        }
      }else{
        await this.TicketModel.updateOne({_id:closeTicketDto.ticketId},{status:"close"})
        return {
          statusCode:200,
          data:{
            ticketId:closeTicketDto.ticketId
          }
        }
      }
    }else{
      return{
        statusCode:400,
        data:{
          message:"unauthorized"
        }
      }
    }
  }

  getPriority(priority:string){
    switch(priority){
      case "high":
        return ["high"]
      case "medium":
        return ["medium","high"]
      case "low":
        return ["low","medium","high"]
      default:
        return []
    }
  }

  async delete(deleteTicketDto:DeleteTicketDto):Promise<any>{
    try {
      const tickets = await this.TicketModel.deleteOne(deleteTicketDto);
      return { statusCode: 200, data: { tickets } }
    } catch (error) {
      return { statusCode: 500, data: { message: error?.message || 'server error' } }
    }
  }
}
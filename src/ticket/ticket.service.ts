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
        const assignedTo = await this.userService.findRandomUser()
        const createdTicket = new this.TicketModel({assignedTo,...createTicketDto});
        const ticket:Ticket = await createdTicket.save();
        resolve({ticketId:ticket._id})
    })
  }

  async findAll(): Promise<Ticket[]> {
    return this.TicketModel.find().exec();
  }

  async findByQuery(query:FindByPriorityDto | FindByStatusDto | FindByTitleDto | FindById): Promise<Ticket[]> {
    return this.TicketModel.find(query).exec();
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
    return await this.TicketModel.deleteOne(deleteTicketDto)
  }
}
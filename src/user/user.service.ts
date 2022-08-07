import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { AuthService } from 'src/shared/auth/auth.service';
import { CreateUserDto } from './dto/create_User.dto';
import { User } from './interface/user.interface';

@Injectable()
export class UserService {
    constructor(
    @Inject('USER_MODEL')
    private UserModel: Model<User>,
    private authService:AuthService
  ) {}

  async create(CreateUserDto: CreateUserDto){
    return new Promise(async (resolve,reject) => {
      const isUserExits = await this.UserModel.findOne({username:CreateUserDto.username})
      if(isUserExits){
        return resolve({message:"user already exits"})
      }
      const createdUser = new this.UserModel(CreateUserDto);
      const user:User = await createdUser.save();
      const token = await this.authService.token(user.username,user.role)
      return resolve(token)
    })
  }

  async findRandomUser():Promise<string>{
    const user =  await this.UserModel.find()
    //generate a random number from 0 to length of the array less then our else stack overflow error you will get
    const randomNumber = Math.floor(Math.random() * ((user.length-1) - 0 + 1)) + 0
    return user[randomNumber].username
  }
}

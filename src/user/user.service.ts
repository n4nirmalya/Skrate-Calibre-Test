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
    private authService: AuthService
  ) { }

  async create(CreateUserDto: CreateUserDto) {
    try {
      return new Promise(async (resolve, reject) => {
        const isUserExits = await this.UserModel.findOne({ username: CreateUserDto.username })
        if (isUserExits) {
          return resolve({ statusCode: 409, data: { message: "user already exits" } })
        }
        const createdUser = new this.UserModel(CreateUserDto);
        const user: User = await createdUser.save();
        const { access_token } = await this.authService.token(user.username, user.role)
        return resolve({ statusCode: 200, data: { access_token } })
      })
    } catch (error) {
      return { statusCode: 500, data: error?.message }
    }

  }

  async findRandomUser(): Promise<string> {
    try {
      const user = await this.UserModel.find()
      //generate a random number from 0 to length of the array less then our else stack overflow error you will get
      const randomNumber = Math.floor(Math.random() * ((user.length - 1) - 0 + 1)) + 0
      return user[randomNumber].username
    } catch (error) {
      return null
    }
  }
}

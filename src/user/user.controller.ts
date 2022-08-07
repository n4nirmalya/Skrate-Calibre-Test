import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create_User.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('new')
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto);
    }
}

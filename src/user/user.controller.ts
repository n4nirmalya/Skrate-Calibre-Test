import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create_User.dto';
import { UserService } from './user.service';
import {Response, Request} from 'express'


@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('new')
    async create(@Body() createUserDto: CreateUserDto,@Res() res: Response, @Req() req: Request) {
        const userData:any = await this.userService.create(createUserDto);
        res.status(userData.statusCode)
        return res.json(userData.data)
    }
}

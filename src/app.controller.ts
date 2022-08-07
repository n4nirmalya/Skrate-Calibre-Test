import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs/promises';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/log')
  async getLog() {
    const data = await fs.readFile('access.log','utf8')
    return data
  }
}

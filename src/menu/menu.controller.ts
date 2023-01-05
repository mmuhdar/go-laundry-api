import { Controller, Get } from '@nestjs/common';

@Controller('menu')
export class MenuController {
  @Get()
  findAll() {
    return {
      name: 'hello world',
    };
  }
}

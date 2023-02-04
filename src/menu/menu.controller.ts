import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MenuDto, UpdateMenuDto } from './dto/menu.dto';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Get()
  findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.menuService.findById(id);
  }

  @Post()
  createMenu(@Body() dto: MenuDto) {
    return this.menuService.createMenu(dto);
  }

  @Patch(':id')
  updateMenu(@Body() dto: UpdateMenuDto, @Param('id') id: string) {
    return this.menuService.updateMenu(id, dto);
  }

  @Delete(':id')
  deleteMenu(@Param('id') id: string) {
    return this.menuService.deleteMenu(id);
  }
}

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MenuDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  price: string;

  @IsNotEmpty()
  @IsString()
  estimateDay: string;
}

export class UpdateMenuDto {
  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  estimateDay?: string;
}

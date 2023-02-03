import { IsNotEmpty, IsString } from 'class-validator';

export class QueryCode {
  @IsNotEmpty()
  @IsString()
  code: string;
}

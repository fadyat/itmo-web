import { ApiProperty } from '@nestjs/swagger';

export class ResponseError {
  @ApiProperty()
  error: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  timestamp: Date;
}

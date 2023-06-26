import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse {
  constructor(result: string) {
    this.result = result;
  }

  @ApiProperty()
  result: string;
}

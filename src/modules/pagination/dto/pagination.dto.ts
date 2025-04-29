import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class PaginationQueryParams {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  readonly take: number = 5;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  readonly page: number = 1;

  @IsOptional()
  @IsNumber()
  readonly sortBy: string = "createdAt";

  @IsOptional()
  @IsNumber()
  readonly sortOrder: string = "desc";
}

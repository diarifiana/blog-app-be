import { IsOptional, IsString } from "class-validator";

export class UpdateBlogDTO {
  @IsOptional()
  @IsString()
  readonly title!: string;

  @IsOptional()
  @IsString()
  readonly description!: string;

  @IsOptional()
  @IsString()
  readonly content!: string;

  @IsOptional()
  @IsString()
  readonly thumbnail!: string;
}

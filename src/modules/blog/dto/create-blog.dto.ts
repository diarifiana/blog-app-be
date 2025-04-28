import { IsNotEmpty, IsString } from "class-validator";

export class CreateBlogDTO {
  @IsNotEmpty()
  @IsString()
  readonly title!: string;

  @IsNotEmpty()
  @IsString()
  readonly description!: string;

  @IsNotEmpty()
  @IsString()
  readonly content!: string;

  @IsNotEmpty()
  @IsString()
  readonly category!: string;
}

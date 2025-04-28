import { injectable } from "tsyringe";
import { PrismaService } from "../prisma/prisma.service";
import { GetBlogsDTO } from "./dto/get-blogs.dto";
import { Prisma } from "../../generated/prisma";
import { CreateBlogDTO } from "./dto/create-blog.dto";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { ApiError } from "../../utils/api-error";
import { generateSlug } from "../../utils/generateSlug";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";

@injectable()
export class BlogService {
  private prisma: PrismaService;
  private cloudinaryService: CloudinaryService;

  constructor(
    PrismaClient: PrismaService,
    CloudinaryService: CloudinaryService
  ) {
    this.prisma = PrismaClient;
    this.cloudinaryService = CloudinaryService;
  }

  getBlogs = async (query: GetBlogsDTO) => {
    const { page, take, sortBy, sortOrder, search } = query;

    const whereClause: Prisma.BlogWhereInput = {
      deletedAt: null,
    };

    if (search) {
      whereClause.title = { contains: search, mode: "insensitive" };
    }

    const blogs = await this.prisma.blog.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * take,
      take,
      include: { user: { omit: { password: true } } },
    });

    const count = await this.prisma.blog.count({ where: whereClause });
    return {
      data: blogs,
      meta: { page, take, total: count },
    };
  };

  getBlogBySlug = async (slug: string) => {
    const blog = await this.prisma.blog.findFirst({
      where: { slug },
      include: { user: { omit: { password: true } } }, // join data
    });

    if (!blog) {
      throw new ApiError("Blog not found", 400);
    }

    return blog;
  };

  createBlog = async (
    body: CreateBlogDTO,
    thumbnail: Express.Multer.File,
    authUserId: number
  ) => {
    const { title } = body;
    const blog = await this.prisma.blog.findFirst({
      where: { title },
    });

    if (blog) {
      throw new ApiError("Title already used", 400);
    }

    const slug = generateSlug(title);

    const { secure_url } = await this.cloudinaryService.upload(thumbnail);

    return await this.prisma.blog.create({
      data: {
        ...body,
        thumbnail: secure_url,
        userId: authUserId,
        slug,
      },
    });
  };
}

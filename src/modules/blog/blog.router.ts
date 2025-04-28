import { Router } from "express";
import { injectable } from "tsyringe";
import { BlogController } from "./blog.controller";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { UploaderMiddleware } from "../../middlewares/uploader.middleware";
import { JWT_SECRET_KEY } from "../../config";
import { CreateBlogDTO } from "./dto/create-blog.dto";
import { validateBody } from "../../middlewares/validation.middleware";

@injectable()
export class BlogRouter {
  private router: Router;
  private blogController: BlogController;
  private jwtMiddleware: JwtMiddleware;
  private uploaderMiddleware: UploaderMiddleware;

  constructor(
    BlogController: BlogController,
    JwtMiddleware: JwtMiddleware,
    UploaderMiddleware: UploaderMiddleware
  ) {
    this.router = Router();
    this.blogController = BlogController;
    this.jwtMiddleware = JwtMiddleware;
    this.uploaderMiddleware = UploaderMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get("/", this.blogController.getBlogs);
    this.router.get("/:slug", this.blogController.getBlogBySlug);
    this.router.post(
      "/",
      this.jwtMiddleware.verifyToken(JWT_SECRET_KEY!),
      this.uploaderMiddleware
        .upload()
        .fields([{ name: "thumbnail", maxCount: 1 }]),
      this.uploaderMiddleware.fileFilter([
        "image/jpeg",
        "image/avif",
        "image/png",
      ]),
      validateBody(CreateBlogDTO),
      this.blogController.createBlog
    );
    this.router.delete(
      "/:id",
      this.jwtMiddleware.verifyToken(JWT_SECRET_KEY!),
      this.blogController.deleteBlog
    );
  };

  getRouter() {
    return this.router;
  }
}

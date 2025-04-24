import { Router } from "express";
import { injectable } from "tsyringe";
import { BlogController } from "./blog.controller";

@injectable()
export class BlogRouter {
  private router: Router;
  private blogController: BlogController;

  constructor(BlogController: BlogController) {
    this.router = Router();
    this.blogController = BlogController;
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get("/", this.blogController.getBlogs);
  };

  getRouter() {
    return this.router;
  }
}

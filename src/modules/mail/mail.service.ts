import nodemailer, { Transporter } from "nodemailer";
import path from "path";
import fs from "fs/promises";
import Handlebars from "handlebars";
import { GMAIL_APP_PASSWORD, GMAIL_EMAIL } from "../../config";

export class MailService {
  private transporter: Transporter;
  private templateDir: string;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_EMAIL,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    this.templateDir = path.resolve(__dirname, "./templates");
  }

  renderTemplate = async (templateName: string, context: object) => {
    const templatePath = path.join(this.templateDir, `${templateName}.hbs`);

    const templateSource = (await fs.readFile(templatePath)).toString();

    const compiledTemplate = Handlebars.compile(templateSource);

    return compiledTemplate(context);
  };

  sendEmail = async (
    to: string,
    subject: string,
    templateName: string,
    context: object
  ) => {
    const html = await this.renderTemplate(templateName, context);

    await this.transporter.sendMail({
      from: "Blog app",
      to: to,
      subject: subject,
      html: html,
    });
  };
}

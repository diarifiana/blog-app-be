import { injectable } from "tsyringe";
import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSampleDTO } from "./dto/create-sample.dto";
import { UpdateSampleDTO } from "./dto/update-sample.dto";

@injectable()
export class SampleService {
  private prisma: PrismaService;

  constructor(PrismaClient: PrismaService) {
    this.prisma = PrismaClient;
  }

  private async findSampleOrThrow(id: number) {
    const sample = await this.prisma.sample.findFirst({
      where: { id },
    });

    if (!sample) {
      throw new ApiError("Sample Not Found", 404);
    }

    return sample;
  }

  getSamples = async () => {
    const samples = await this.prisma.sample.findMany();
    return samples;
  };

  getSample = async (id: number) => {
    const sample = await this.findSampleOrThrow(id);
    return sample;
  };

  createSample = async (body: CreateSampleDTO) => {
    return await this.prisma.sample.create({
      data: body,
    });
  };

  updateSample = async (id: number, body: UpdateSampleDTO) => {
    await this.findSampleOrThrow(id);

    return await this.prisma.sample.update({
      where: { id },
      data: body,
    });
  };

  deleteSample = async (id: number) => {
    await this.findSampleOrThrow(id);

    await this.prisma.sample.delete({
      where: { id },
    });

    return { message: "delete sample success" };
  };
}

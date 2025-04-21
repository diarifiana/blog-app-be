import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaClient } from "../src/generated/prisma";

export type Context = {
  prisma: PrismaClient;
};

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>;
};

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
  };
};

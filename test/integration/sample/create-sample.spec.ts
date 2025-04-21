import request from "supertest";
import { App } from "../../../src/app";

describe("POST /samples", () => {
  const { app } = new App();
  it("should successfuly create a sample", async () => {
    const reqBody = { name: "Mock sample name" };

    const response = await request(app).post("/samples").send(reqBody);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
  });

  it("should return an error when req body name is missing", async () => {
    const response = await request(app).post("/samples").send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "name must be a string,name should not be empty"
    );
  });
});

const mongoose = require("mongoose");

const request = require("supertest");
const app = require("../app");

const { DB_HOST, PORT } = process.env;

mongoose.set("strictQuery", true);

describe("test auth controllers", () => {
  let server;
  let token;
  beforeAll(async () => {
    await mongoose.connect(DB_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    server = app.listen(PORT, () => {
      console.log(`Database connection successful on the Port:${PORT}`);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  test("register should return status 201", async () => {
    const response = await request(server)
      .post("/api/auth/register")
      .send({ email: "alex@com.ua", password: "123456" });
    expect(response.status).toBe(201);
    expect(typeof response.body.user).toBe("object");
    expect(typeof response.body.user.email).toBe("string");
    expect(typeof response.body.user.subscription).toBe("string");
  });

  it("login should return status 200", async () => {
    const response = await request(server)
      .post("/api/auth/login")
      .send({ email: "alex@com.ua", password: "123456" });
    token = response.body.token;
    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
    expect(typeof response.body.user).toBe("object");
    expect(typeof response.body.user.email).toBe("string");
    expect(typeof response.body.user.subscription).toBe("string");
  });

  it("login should return status 400 if email or password is missing", async () => {
    const response = await request(server).post("/api/auth/login").send();
    expect(response.status).toBe(400);
  });

  it("logout should return status 204", async () => {
    const response = await request(server)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(204);
    expect(response.body).toStrictEqual({});
  });
});

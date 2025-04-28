const request = require("supertest");
const data = require("../db/data/test-data");
const db = require("../db/connection")
const app = require("../app");
const endpointsJson = require("../endpoints.json");
const seed = require("../db/seeds/seed")

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with a json object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
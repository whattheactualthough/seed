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

describe("GET /api/topics", () => {
  test("200: Responds with all topics ", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({body}) =>{
      expect(body.topics).toHaveLength(3)
      body.topics.forEach((topic) => {
        expect(topic).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String)
        });
      });
    });
  });
});
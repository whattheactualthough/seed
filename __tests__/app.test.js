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

describe("GET /api/articles/:article_id", () => {
  test("200: responds with article object of correct id", () => {
    return request(app)
    .get("/api/articles/5")
    .expect(200)
    .then((response) => {
      const article = response.body.article[0]
      expect(article.title).toEqual("UNCOVERED: catspiracy to bring down democracy"),
      expect(article.topic).toBe("cats"),
      expect(article.author).toBe("rogersop"),
      expect(article.body).toBe("Bastet walks amongst us, and the cats are taking arms!"),
      expect(article.created_at).toBe('2020-08-03T13:14:00.000Z')
      expect(article.votes).toBe(0)
  });
});
  test("400: responds with Bad Request for psql errors", () => {
    return request(app)
    .get("/api/articles/cats")
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad Request")
    });
  });
  test("404: responds with Not Found for out of range requests", () => {
    return request(app)
    .get("/api/articles/10000")
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("Not Found")
    });
  });
});

describe("GET /api/articles", () => {
  test("200: reponds with array of all article objects sorted by descending date", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body}) => {
      expect(body.articles.length).toBeGreaterThan(1);
      expect(body.articles).toBeSortedBy("created_at")
      body.articles.forEach((article) => {
        expect(article).toMatchObject({
          title: expect.any(String),
          article_id:expect.any(Number),
          topic:expect.any(String),
          author:expect.any(String),
          created_at:expect.any(String),
          votes:expect.any(Number),
          comment_count:expect.any(Number)
        });
      });
    });
  });
 });

 describe("GET api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments for given article", () => {
    return request(app)
    .get("/api/articles/5/comments")
    .expect(200)
    .then((response) => {
      expect(response.body.comments.length).toBeGreaterThan(0)
      expect(response.body.comments).toBeSorted("created_at")
      response.body.comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id:expect.any(Number),
          votes:expect.any(Number),
          created_at:expect.any(String),
          author:expect.any(String),
          body:expect.any(String),
          article_id: expect.any(Number)
        });
      });
    });
  });
    test("400: Bad Request error message for invalid article_id", ()=> {
      return request(app)
      .get("/api/articles/morecats/comments")
      .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad Request")
    });
    });
    test("404: responds with Not Found for out of range requests", () => {
      return request(app)
      .get("/api/articles/10000/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found")
      });
    });
 });
 
 

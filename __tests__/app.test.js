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
      const article = response.body.article
      expect(article.title).toEqual("UNCOVERED: catspiracy to bring down democracy"),
      expect(article.topic).toBe("cats"),
      expect(article.author).toBe("rogersop"),
      expect(article.body).toBe("Bastet walks amongst us, and the cats are taking arms!"),
      expect(article.created_at).toBe('2020-08-03T13:14:00.000Z')
      expect(article.votes).toBe(0)
      expect(article.comment_count).toBe(2)
  });
});
  test("400: responds with Bad Request for invalid article_id", () => {
    return request(app)
    .get("/api/articles/cats")
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad Request")
    });
  });
  test("404: responds with Not Found when passed a non existent article_id", () => {
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
      expect(body.articles).toBeSorted("created_at")
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

  const sortByGreenList = [
    'article_id', 
    'title', 
    'topic', 
    'author',  
    'created_at', 
    'votes', 
   ]
   describe("GET /api/articles?sort_by=value&order=value", () => {
    sortByGreenList.forEach((column) => {
    test("200: responds with articles sorted by given value, defaults to SORT BY ${column} DESC" , () => {
      return request(app)
      .get(`/api/articles?sort_by=${column}&order=DESC`)
      .expect(200)
      .then(({body}) => {
        console.log(body)
        expect(body.articles.length).toBeGreaterThan(0)
        expect(body.articles).toBeSortedBy(column, {descending: true})
      });
     });
    });
    sortByGreenList.forEach((column) => {
    test("200: responds with articles sorted by given value, SORT BY ${column} ASC" , () => {
      return request(app)
      .get(`/api/articles?sort_by=${column}&order=ASC`)
      .expect(200)
      .then(({body}) => {
        expect(body.articles.length).toBeGreaterThan(0)
        expect(body.articles).toBeSortedBy(column, { ascending: true })
      })
    });
  });
  test("200: when given no sort_by value articles array is sorted by created_at as default", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body}) => {
      expect(body.articles).toBeSortedBy("created_at", {descending: true})
    })
  });
  test("200: responds with array of article objects sorted by given value DESC as default order", () => {
    return request(app)
    .get("/api/articles?sort_by=topic")
    .expect(200)
    .then(({body}) => {
      expect(body.articles).toBeSortedBy("topic", {descending: true})
    })
  });
  test("400: responds with Invalid sort by query", () => {
    return request(app)
    .get("/api/articles?sort_by=notAColumn")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Invalid sort by value")
    })
  });
  test("400: responds with Invalid order value", () => {
    return request(app)
    .get("/api/articles?sort_by=topic&order=notAnOrder")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Invalid order value")
    })
    })
  });

  describe("GET /api/articles?topic=value", () => {
    test("200: responds with all articles of given topic", () => {
      return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({body})=> {
        expect(body.articles.length).toBeGreaterThan(0)
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch")
          })
        })
      })
      test("400: responds with invalid topic for topics not on greenlist", () => {
        return request(app)
        .get("/api/articles?topic=scuba")
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Invalid topic")
        })
      });
      test("404: responds with Articles not found when given a valid topic with no articles associated with it", ()=> {
        return request(app)
        .get("/api/articles?topic=paper")
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("Article not found")
        })
      })
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

 describe("POST api/articles/:article_id/comments", () => {
  test("200: responds with posted comment if comment is valid and user exists in users db", () => {
    const testComment = {
      username: "lurker",
      body: "testing testing"
    }
    return request(app)
    .post("/api/articles/5/comments")
    .send(testComment)
    .expect(201)
    .then((response) => {
      const comment = response.body.comment
      expect(comment.comment_id).toBe(19),
      expect(comment.article_id).toBe(5),
      expect(comment.body).toBe("testing testing"),
      expect(comment.author).toBe("lurker"),
      expect(typeof comment.created_at).toBe("string")
      });
    });
    test("400: responds with Missing required fields if comment object is empty", () => {
      const testComment = {}
      return request(app)
      .post("/api/articles/5/comments")
      .send(testComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Missing required fields")
      })
    })
    test("400: responds with Missing required fields if comment object is missing one or both required fields", () => {
      const testComment = {
        username: "lurker"
      }
      return request(app)
      .post("/api/articles/5/comments")
      .send(testComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Missing required fields")
      })
    })
    test("404: Responds with User not found if user is invalid ", () => {
      const testComment = {
        username: "notAUser",
        body: "testing testing"
      }
      return request(app)
      .post("/api/articles/5/comments")
      .send(testComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("User not found")
      })
    })
    test("404: Responds with Article not found if article_id is invalid ", () => {
      const testComment = {
        username: "notAUser",
        body: "testing testing"
      }
      return request(app)
      .post("/api/articles/notanarticle/comments")
      .send(testComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request")
      })
    })
  });

  describe("PATCH /api/articles/:article_id", () => {
    test("200: responds with updated article", () => {
    const testPatch = {inc_votes: 10};
    return request(app)
    .patch("/api/articles/5")
    .send(testPatch)
    .expect(200)
    .then((result) => {
      const article = result.body.article
      expect(article.votes).toBe(10)
  });
  });
  test("400: responds with Missing required field when passed an empty object", () => {
    return request(app)
    .patch("/api/articles/5")
    .send({})
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Missing required fields")
    })
   });
   test("400: responds with Bad request when passed invalid value as inc_votes", () => {
    return request(app)
    .patch("/api/articles/5")
    .send({inc_votes: "notANumber"})
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad request")
    })
   });
   test('404: responds with Article not found when passed a non existent article_id', () => {
    return request(app)
    .patch("/api/articles/1000")
    .send({inc_votes: 5})
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Article not found")
    })
   });
   test('400: responds with Bad request when passed an invalid article_id', () => {
    return request(app)
    .patch("/api/articles/notAnArticle")
    .send({inc_vote:5})
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Invalid article id")
    })
   });
 });

  describe("DELETE /api/comments/:comment_id", ()=> {
    test('204: responds with no content', () => {
      return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then(() => {return db.query(`SELECT * FROM comments WHERE comment_id = 1000`)
        .then(({rows}) => {expect(rows.length).toBe(0)})
      })
    });
    test('400: responds with "bad request when passed an invalid comment_id', () => {
      return request(app)
      .delete("/api/comments/notAComment")
      .expect(400)
      .then(({body}) =>{
        expect(body.msg).toBe("Bad request")
      })
    })
      test('404: responds with "Comment not found when passed a non existent comment_id', () => {
        return request(app)
        .delete("/api/comments/1000")
        .expect(404)
        .then(({body}) =>{
          expect(body.msg).toBe("Comment not found")
        })
    });
  });

 describe("GET /api/users",() => {
  test("200: responds with array of user objects", () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body}) => {
      expect(body.users.length).toBeGreaterThan(0);
      body.users.forEach((user) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String)
        });
      });
    });
  });
 });
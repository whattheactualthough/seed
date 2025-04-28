const db = require("../connection")
const format = require('pg-format')
const { convertTimestampToDate, createRef } = require('./utils')

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS comments`)
    .then(()=>{
    return db.query(`DROP TABLE IF EXISTS articles`)
    })
    .then(()=>{
    return db.query(`DROP TABLE IF EXISTS topics;`)
    })
    .then(() => {
    return db.query(`CREATE TABLE topics(
      slug VARCHAR(100) PRIMARY KEY,
      description VARCHAR(1000),
      img_url VARCHAR(1000));`)
      })
      .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`)
      })
      .then(() => {
      return db.query(`CREATE TABLE users(
      username VARCHAR(100) PRIMARY KEY,
      name VARCHAR(100),
      avatar_url VARCHAR(1000));`)
     })
      .then(()=> {
      return db.query(`CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(1000),
      topic VARCHAR(100) REFERENCES topics(slug),
      author VARCHAR(100) REFERENCES users(username),
     body TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
      );`)
      })
      .then(() => {
       return db.query(`CREATE TABLE comments(
      comment_id SERIAL PRIMARY KEY,
      article_id SERIAL REFERENCES articles(article_id), 
      body TEXT, 
      votes INT DEFAULT 0, 
      author VARCHAR(100) REFERENCES users(username), 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`)
      })
      .then(() => {// format data to fit into topic table : slug, description, img_url)
       const formattedTopics = topicData.map((topic) => {
     return [topic.slug, topic.description, topic.img_url];
      });
      const insertTopicQuery = format(`INSERT INTO topics(slug, description, img_url) VALUES %L;`, formattedTopics);
    return db.query(insertTopicQuery)
    })
     .then(() => { // format data to fit into users table : username, name, avatar_url
  const formattedUsers = userData.map((user) => {
    return[user.username, user.name, user.img_url];
  });
  const insertUserQuery = format(`INSERT INTO users (username, name, avatar_url) VALUES %L;`, formattedUsers);
  return db.query(insertUserQuery)
      })
      .then(() => {// format data to fit articles table: 
      // article_id *TO ADD *, title, topic, author, body, created_at,  votes, article_img_url
      const formattedArticles = articleData.map((article) => {

      const timeConvertedArticle = convertTimestampToDate(article);
     return[timeConvertedArticle.title, 
      timeConvertedArticle.topic, 
      timeConvertedArticle.author, 
      timeConvertedArticle.body, 
      timeConvertedArticle.created_at, 
      timeConvertedArticle.votes, 
      timeConvertedArticle.article_img_url]
      });
     const insertArticleQuery = format(`INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING*`, formattedArticles);
      return db.query(insertArticleQuery)
      })   
      .then((result) => {
       const articlesRefObject = createRef(result.rows);
       const formattedComments = commentData.map((comment) => {
        const timeFormattedComments = convertTimestampToDate(comment);
        return [
          articlesRefObject[comment.article_title],
          timeFormattedComments.body,
          timeFormattedComments.votes,
          timeFormattedComments.author,
          timeFormattedComments.created_at
        ];
      
      });
      const insertCommentQuery = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at)
        VALUES %L`, 
        formattedComments
      );
      return db.query(insertCommentQuery);
    })
  .then(() => {
    console.log("Seed complete")
  });
};


module.exports = seed;

const db = require("../../db/connection");

const checkCommentExists = async (comment_id) => {
    const dbOutput = await db.query(
        `SELECT * FROM comments WHERE comments.comment_id = $1;`,
        [comment_id]
      );
      if (dbOutput.rows.length === 0) {
        return Promise.reject({ 
          status: 404, 
          msg: "Comment not found" });
      } else {
          return true
      }
    };

    const checkUserExists = async (user) => {
        return db.query(
          `SELECT * FROM users WHERE users.username = $1;`,
          [user]
        )
        .then(({rows}) => {
          if (rows.length === 0) {
            return Promise.reject({ status: 
              404, msg: 
              "User not found" });
          } else {
              return rows[0]
          }
        })
        
      };

      const checkArticleExists = async (article_id) => {
        const { rows } = await db.query(`
          SELECT * FROM articles 
          WHERE articles.article_id = $1;`,
          [article_id]);
      
        if (rows.length === 0) {
          throw{ 
            status: 404, 
            msg: "Article not found" };
        }
      
        return true;
      };

      const fetchTopics = (topic) => {
        return db.query('SELECT * FROM topics WHERE topics.slug = $1', [topic]).then(({ rows }) => {
          console.log(rows)
          if(rows.length === 0){
           return Promise.reject({
            status: 404,
            msg: "Topic does not exist"
           })
          }
        });
      };
    

module.exports = { 
  checkCommentExists, 
  checkUserExists, 
  checkArticleExists,
fetchTopics}
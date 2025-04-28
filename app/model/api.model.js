const endpoints = require("../../endpoints.json")

const sendApi = () => {
    return new Promise((resolve, reject) => {
      if (!endpoints) {
        Promise.reject({status:404, msg: "Not Found"})
      } else {
        resolve(endpoints);
      }
    });
  };
module.exports = {sendApi}

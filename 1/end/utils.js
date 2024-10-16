// const mysql = require("mysql2")

// const pool = mysql.createPool({
//   host: process.env.HOST,
//   user: process.env.USER,
//   password: process.env.PASSWORD,
//   database: process.env.DATABASE,
//   multipleStatements: true,
//   connectionLimit: 10,
//   connectTimeout: 60 * 60 * 1000,
//   acquireTimeout: 60 * 60 * 1000,
//   timeout: 60 * 60 * 1000,
//   port: process.env.PORT,
// })

// async function getSqlData(sql) {
//   return new Promise((resolve, reject) => {
//     try {
//       pool.query(sql, (err, sqlRes) => {
//         if (err) {
//           reject(err)
//         } else {
//           resolve(sqlRes)
//         }
//       })
//     } catch (error) {
//       reject(error)
//     }
//   })
// }

const operation = (res, code, data, message) => {
  res.send({
    code,
    data,
    message,
  })
}

const sendRes = {
  success: (res, data = []) => {
    operation(res, 200, data)
  },
  error: (res, data = []) => {
    operation(res, 500, data)
  },
  warn: (res, data = []) => {
    operation(res, 400, data)
  },
  msgs: (res, message, data = []) => {
    operation(res, 300, data, message)
  },
  msge: (res, message, data = []) => {
    operation(res, 301, data, message)
  },
}

module.exports = {
  // getSqlData,
  sendRes,
}

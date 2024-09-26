const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const cors = require("cors")

// 引入全局属性
require("dotenv").config()

// 解决前端跨域
app.use(cors())

// post参数解析
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 引入路由
const user = require("./src/user")
const data = require("./src/data")

app.use("/user", user)
app.use("/data", data)

app.listen(3000, "0.0.0.0", () => {
  console.log("Server is running on port 3000")
})

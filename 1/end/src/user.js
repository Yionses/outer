const express = require("express")
const router = express.Router()
const { sendRes } = require("../utils")

// 引入全局属性
require("dotenv").config()

router.post("/login", async (req, res) => {
  const { password } = req.body
  if (password === process.env.PASS) {
    sendRes.msgs(res, "登录成功")
  } else {
    sendRes.msge(res, "密码错误")
  }
})

module.exports = router

const express = require("express")
const router = express.Router()
const { sendRes } = require("../utils")

router.post("/login", async (req, res) => {
  const { pass } = req.body
  if (pass === "123456") {
    sendRes.msgs(res, "登录成功")
  } else {
    sendRes.msge(res, "密码错误")
  }
})

module.exports = router

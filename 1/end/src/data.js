const express = require("express")
const router = express.Router()
const { sendRes } = require("../utils")
const fs = require("fs")
const OSS = require("ali-oss")
const client = new OSS({
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET
})
require("dotenv").config()

router.post("/upload", async (req, res) => {
  fs.readFile("enter.json", "utf8", (err, data) => {
    if (err) return
    // Parse old data
    let obj = JSON.parse(data)

    // Add new data
    obj.push(...req.body.data)

    // Convert back to JSON and write to the file
    let json = JSON.stringify(obj)
    fs.writeFile("enter.json", json, "utf8", () => {})
    fs.writeFile("enterBackup.json", json, "utf8", () => {})
    sendRes.msgs(res, "上传成功")
  })
})

router.post("/outerUpload", async (req, res) => {
  // 读取文件内容
  var excelObj = req.body.data

  const outerDate = excelObj[0]?.[0].split("出库明细表")?.[0] || "暂无出库时间"

  const outerData = []

  for (let i = 3; i < excelObj.length - 1; i++) {
    outerData.push([
      excelObj[i][0],
      excelObj[i][1] ? excelObj[i][1] : "无规格",
      excelObj[i][2],
      excelObj[i][3],
      excelObj[i][4],
      excelObj[i][5],
      +new Date(outerDate.replace("年", "-").replace("月", "-") + "1")
    ])
  }
  fs.readFile("outer.json", "utf8", (err, data) => {
    if (err) return
    // Parse old data
    let obj = JSON.parse(data)

    // Add new data
    obj.push(...outerData)

    // Convert back to JSON and write to the file
    let json = JSON.stringify(obj)
    fs.writeFile("outer.json", json, "utf8", () => {})
    fs.writeFile("outerBackup.json", json, "utf8", () => {})
    sendRes.msgs(res, "上传成功")
  })
})

router.get("/material", async (req, res) => {
  const resData = []
  const fileData = JSON.parse(fs.readFileSync("enter.json", "utf8"))
  const fileOuterData = JSON.parse(fs.readFileSync("outer.json", "utf8"))

  fileData.forEach((item) => {
    if (!resData.includes(item[0])) {
      resData.push(item[0])
    }
  })
  fileOuterData.forEach((item) => {
    if (!resData.includes(item[0])) {
      resData.push(item[0])
    }
  })
  sendRes.success(res, resData, "获取成功")
})

router.post("/specifications", async (req, res) => {
  const { material } = req.body

  const resData = []
  const fileData = JSON.parse(fs.readFileSync("enter.json", "utf8"))
  const fileOuterData = JSON.parse(fs.readFileSync("outer.json", "utf8"))
  fileData.forEach((item) => {
    if (item[0] === material && !resData.includes(item[1])) {
      resData.push(item[1])
    }
  })
  fileOuterData.forEach((item) => {
    if (item[0] === material && !resData.includes(item[1])) {
      resData.push(item[1])
    }
  })

  sendRes.success(res, resData, "获取成功")
})

function getDataList(material, specifications, year = "") {
  const enterData = JSON.parse(fs.readFileSync("enter.json", "utf8"))
  const outerData = JSON.parse(fs.readFileSync("outer.json", "utf8"))

  let targetData = []

  enterData.forEach((item) => {
    if (item?.[0] === material && item?.[1] === specifications) {
      targetData.push([
        item[0],
        item[1],
        item[2],
        item[3],
        item[4],
        item[5],
        item[10],
        "入"
      ])
    }
  })

  outerData.forEach((item) => {
    if (item?.[0] === material && item?.[1] === specifications) {
      targetData.push([
        item[0],
        item[1],
        item[3],
        item[2],
        item[4],
        item[5],
        item[6],
        "出"
      ])
    }
  })

  if (year) {
    targetData = targetData.filter(
      (item) =>
        item[6] >= +new Date(`${year}-01-01  00:00:00`) &&
        item[6] <= +new Date(`${year}-12-31  00:00:00`)
    )
  }

  const sortData = targetData.sort((a, b) => {
    if (Number(a[6]) - Number(b[6]) === 0) {
      if (a[7] === "入") {
        return -1
      } else {
        return 1
      }
    } else {
      return Number(a[6]) - Number(b[6])
    }
  })
  let totalNumber = 0
  let totalPrice = 0

  sortData.forEach((item, index) => {
    if (item[7] === "入") {
      totalNumber += Number(item[2])
      totalPrice += Number(item[5])
    } else {
      totalNumber -= Number(item[2])
      totalPrice -= Number(item[5])
    }
    if (
      index === targetData.length - 1 ||
      targetData[index + 1][7] !== item[7]
    ) {
      item.push(totalPrice, totalNumber)
    }
  })
  return sortData
}

router.post("/data", async (req, res) => {
  const { material, specification, year } = req.body
  const data = getDataList(material, specification, year)
  sendRes.success(res, data, "获取成功")
})

async function getBuffer(fileName) {
  try {
    const result = await client.get(fileName)
    return JSON.parse(result.content.toString("utf8"))
  } catch (e) {
    throw new Error("读取文件错误！")
  }
}

module.exports = router

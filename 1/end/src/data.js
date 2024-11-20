const express = require("express")
const router = express.Router()
const { sendRes } = require("../utils")
const OSS = require("ali-oss")
require("dotenv").config()

const client = new OSS({
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET,
})

async function getBuffer(fileName) {
  try {
    const result = await client.get(fileName)
    return JSON.parse(result.content.toString("utf8"))
  } catch (e) {
    throw new Error("读取文件错误！")
  }
}

async function updateContent(fileName, newArr) {
  try {
    let result = await client.get(fileName + ".json")
    let arr = JSON.parse(result.content.toString("utf8"))

    arr.push(...newArr)

    let buffer = Buffer.from(JSON.stringify(arr))
    await client.put(fileName + ".json", buffer)

    // 备份文件也要读
    result = await client.get(fileName + "Backup.json")
    await client.put(fileName + "Backup.json", buffer)
  } catch (e) {
    throw new Error("读取文件错误！")
  }
}

router.post("/upload", async (req, res) => {
  try {
    await updateContent("enter", req.body.data)
    sendRes.msgs(res, "上传成功！")
  } catch (error) {
    sendRes.msge(res, error?.message || "请联系开发者！")
  }
})

router.post("/outerUpload", async (req, res) => {
  try {
    // 读取文件内容
    var excelObj = req.body.data

    const outerDate =
      excelObj[0]?.[0].split("出库明细表")?.[0] || "暂无出库时间"

    const outerData = []

    for (let i = 3; i < excelObj.length - 1; i++) {
      outerData.push([
        excelObj[i][0],
        excelObj[i][1] ? excelObj[i][1] : "无规格",
        excelObj[i][2],
        excelObj[i][3],
        excelObj[i][4],
        excelObj[i][5],
        +new Date(outerDate.replace("年", "-").replace("月", "-") + "1"),
      ])
    }
    await updateContent("outer", outerData)
    sendRes.msgs(res, "上传成功！")
  } catch (error) {
    sendRes.msge(res, error?.message || "请联系开发者！")
  }
})

router.get("/material", async (req, res) => {
  const resData = []
  let fileData = []
  let fileOuterData = []
  try {
    fileData = await getBuffer("enter.json")
    fileOuterData = await getBuffer("outer.json")
  } catch (error) {
    sendRes.msge(res, "请联系开发者！")
    return
  }

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
  let fileData = []
  let fileOuterData = []
  try {
    fileData = await getBuffer("enter.json")
    fileOuterData = await getBuffer("outer.json")
  } catch (error) {
    sendRes.msge(res, "请联系开发者！")
    return
  }
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

async function getDataList(material, specifications, year = "") {
  let enterData = []
  let outerData = []
  try {
    enterData = await getBuffer("enter.json")
    outerData = await getBuffer("outer.json")
  } catch (error) {
    sendRes.msge(res, "请联系开发者！")
    return
  }
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
        "入",
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
        "出",
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
  let data = []
  try {
    data = await getDataList(material, specification, year)
  } catch (error) {
    sendRes.msge(res, "请联系开发者！")
    return
  }
  sendRes.success(res, data, "获取成功")
})

module.exports = router

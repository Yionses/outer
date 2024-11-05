const express = require("express")
const router = express.Router()
const { sendRes } = require("../utils")
const fs = require("fs")
var xlsx = require("node-xlsx")

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
  var obj = xlsx.parse(__dirname + "/../outer.xlsx")
  var excelObj = obj[0].data

  const outerDate = excelObj[0]?.[0].split("出库明细表")?.[0] || "暂无出库时间"

  const outerData = []

  for (let i = 3; i < excelObj.length - 1; i++) {
    outerData.push([
      ...excelObj[i],
      +new Date(outerDate.replace("年", "-").replace("月", "-") + "1"),
    ])
  }
})

router.get("/material", async (req, res) => {
  const resData = []
  const fileData = JSON.parse(fs.readFileSync("enter.json", "utf8"))

  fileData.forEach((item) => {
    if (!resData.includes(item[0])) {
      resData.push(item[0])
    }
  })
  console.log(resData)
})

router.get("/specifications", async (req, res) => {
  // const { material } = req.param
  const material = "45#碳结圆钢"
  const resData = []
  const fileData = JSON.parse(fs.readFileSync("enter.json", "utf8"))
  fileData.forEach((item) => {
    if (item[0] === material && !resData.includes(item[1])) {
      resData.push(item[1])
    }
  })
  console.log(resData)
})

router.get("/data", async (req, res) => {
  // const { material, specifications, year } = req.param
  const material = "45#碳结圆钢"
  const specifications = "Ф35mm"
  let year = "2023"
  const enterData = JSON.parse(fs.readFileSync("enter.json", "utf8"))
  const outerData = JSON.parse(fs.readFileSync("outer.json", "utf8"))
  let targetData = []

  enterData.forEach((item) => {
    if (item?.[0] === material && item?.[1] === specifications) {
      targetData.push([...item, "入"])
    }
  })

  outerData.forEach((item) => {
    if (item?.[0] === material && item?.[1] === specifications) {
      targetData.push([...item, "出"])
    }
  })

  if (year) {
    targetData = targetData.filter(
      (item) =>
        item[9] >= +new Date(`${year}-01-01`) &&
        item[9] <= +new Date(`${year}-12-31`)
    )
  }

  const sortData = targetData.sort((a, b) => {
    if (Number(a[9]) - Number(b[9]) === 0) {
      if (a[10] === "入") {
        return -1
      } else {
        return 1
      }
    } else {
      return Number(a[9]) - Number(b[9])
    }
  })
  let totalNumber = 0
  let totalPrice = 0
  sortData.forEach((item, index) => {
    if (item[10] === "入") {
      totalNumber += Number(item[2])
      totalPrice += Number(item[5])
    } else {
      totalNumber -= Number(item[2])
      totalPrice -= Number(item[5])
    }
    if (
      index === targetData.length - 1 ||
      targetData[index + 1][10] !== item[10]
    ) {
      item.push({
        number: totalNumber,
        price: totalPrice,
      })
    }
  })
  console.log(sortData) //  最终返回数据
  // 生成Excel尚缺
})
module.exports = router

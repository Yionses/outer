const express = require("express")
const router = express.Router()
const { sendRes } = require("./utils")
const { data, testData } = require("./data")
const fs = require("fs")

// router.post("/upload", async (req, res) => {
let i = -1
const container = [] // item-单子
let isNewContainer = false
// 区分每一张单子
testData.forEach((perContainer) => {
  isNewContainer = false
  if (perContainer[0]?.includes("有限公司材料入库单")) {
    i++
    isNewContainer = true
  }
  if (isNewContainer) {
    container[i] = []
  }
  container[i].push(perContainer)
})

// 第一次处理，把数据分割开
const resultData_1 = []
i = -1
container.forEach((paper) => {
  i++
  resultData_1[i] = {
    supplier: "",
    date: "",
    data: [],
  }
  // 供应商和时间
  paper.forEach((item) => {
    if (item?.[0]?.includes("供应商")) {
      resultData_1[i]["supplier"] = item[0]
      resultData_1[i]["date"] = item[item.length - 1]
    }
    if (item?.[0] === "") {
      resultData_1[i].data.push(item)
    }
  })
})

// 第二次处理，把物料数据合并
// resultData_1.forEach((result) => {
//   result.data.forEach((material) => {
//     const key = material?.[1] + material?.[2] + material[5]
//     if (result?.res?.[key]) {
//       const { weight, total, tax } = result.res[key]
//       result.res[key] = {
//         ...result.res[key],
//         weight: parseFloat(weight) + parseFloat(material[3]),
//         total: parseFloat(total) + parseFloat(material[6]),
//         tax: parseFloat(tax) + parseFloat(material[7]),
//       }
//     } else {
//       result.res[key] = {
//         weight: material[3],
//         unit: material[4],
//         price: material[5],
//         total: material[6],
//         tax: material[7],
//       }
//     }
//   })
// })
//   sendRes.success(res, resultData_1)

const resData = []

resultData_1.forEach((corporation) => {
  corporation.data.forEach((material) => {
    resData.push([
      ...material.filter((_, index) => index > 0),
      corporation.supplier,
      corporation.date,
      +new Date("2023-10-30"),
    ])
  })
})

fs.readFile("enter.json", "utf8", (err, data) => {
  if (err) return
  // Parse old data
  let obj = JSON.parse(data)

  // Add new data
  obj.push(...resData)

  // Convert back to JSON and write to the file
  let json = JSON.stringify(obj)
  fs.writeFile("enter.json", json, "utf8", () => {})
  fs.writeFile("enterBackup.json", json, "utf8", () => {})
})
// })

router.get("/material", async (req, res) => {
  const resData = []
  const fileData = JSON.parse(fs.readFileSync("enter.json", "utf8"))

  fileData.forEach((item) => {
    if (!resData.includes(item[0])) {
      resData.push(item[0])
    }
  })
})

router.get("/specifications", async (req, res) => {
  // const { material } = req.param
  const material = "轴承"
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

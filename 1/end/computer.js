const express = require("express")
const router = express.Router()
const { sendRes } = require("./utils")
const { data, testData } = require("./data")
const fs = require("fs")

router.post("/test", async (req, res) => {
  let i = -1
  const container = [] // item-单子
  let isNewContainer = false
  // 区分每一张单子
  data.forEach((perContainer) => {
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
        ...material.filter((item) => item != ""),
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
})

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
  const material = "仓储物流服务"
  const resData = []
  const fileData = JSON.parse(fs.readFileSync("enter.json", "utf8"))
  fileData.forEach((item) => {
    if (item[0] === material && !resData.includes(item[2])) {
      resData.push(item[2])
    }
  })
  console.log(resData)
})

module.exports = router

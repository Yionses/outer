const express = require("express")
const router = express.Router()
const { sendRes } = require("../utils")
const fs = require("fs")
const outerBaseData = [
  ["2018年2月出库明细表"],
  ["糙面橡皮", undefined, "米", 5000, 3.07, 15384.62, 1517414400000],
  ["变速器", "RXL-200B-IW", "套", 60, 1295, 77700, 1517414400000],
  ["纺织配件", undefined, "件", 4330, 25.72, 111359.01, 1517414400000],
  ["喷水织机标准件", undefined, "套", 70, 564.11, 39487.18, 1517414400000],
  ["齿轮", undefined, "件", 1300, 45.64, 59332, 1517414400000],
  ["变频器", "ATV303H075N4", "台", 100, 811.76, 81176, 1517414400000],
  ["变频器", "ATV303HU15N4", "台", 180, 1063.85, 191493.69, 1517414400000],
  ["变频器", "ATV310H075N4", "台", 130, 738.46, 95999.8, 1517414400000],
  ["变频器", "ATV310HU15N4", "台", 98, 817.95, 80159.1, 1517414400000],
  ["变频器", "ATV310HU22N4", "台", 100, 951.28, 95128.34, 1517414400000],
  ["人机界面", "TPC7062KD", "台", 48, 345.9, 16603.79, 1517414400000],
  ["针布", undefined, "套", 20, 2290.598, 45811.96, 1517414400000],
  ["调整螺栓", undefined, "件", 200, 42.75, 8547.01, 1517414400000],
  ["轴", undefined, "件", 76, 235.41, 17891.16, 1517414400000],
  ["铜件", undefined, "件", 6334, 27.69, 175388.46, 1517414400000],
  ["轴承壳", undefined, "件", 56, 256.41, 14358.97, 1517414400000],
  ["加压一体式传感器", undefined, "套", 60, 367.52, 22051.2, 1517414400000],
  ["和毛机", "BC262", "台", 1, 51709.4, 51709.4, 1517414400000],
  ["梳棉机", "A186F", "台", 2, 26324.79, 52649.57, 1517414400000],
  ["稀料", undefined, "桶", 275, 66.67, 18333.33, 1517414400000],
  ["铸件", undefined, "件", 36674, 5.94, 238798.87, 1517414400000],
  ["棕丝", undefined, "万片", 108, 466.919907407407, 50427.35, 1517414400000],
  ["双喷电子储纬器", undefined, "套", 10, 8547.01, 85470.09, 1517414400000],
  ["墙板", undefined, "套", 32, 2412.26, 77192.32, 1517414400000],
  ["织机集成控制系统", undefined, "套", 20, 8888.89, 177777.78, 1517414400000],
  ["切割带", undefined, "条", 709, 14.69, 10411.91, 1517414400000],
  ["喷水钢筘", undefined, "件", 40, 163.53, 6541.2, 1517414400000],
  ["通风机", undefined, "台", 60, 410.25, 24615.38, 1517414400000],
  ["轴承", undefined, "套", 6743, 10.14, 335970.75, 1517414400000],
  ["皮带轮", undefined, "件", 35, 92.5, 3237.6, 1517414400000],
  ["钢化玻璃", undefined, "平方米", 80.6, 47.01, 3788.89, 1517414400000],
  ["WPA70-60", undefined, "台", 30, 222.22, 6666.66, 1517414400000],
  ["高纯氮气", undefined, "瓶", 20, 72.65, 1452.99, 1517414400000],
  ["硅酮胶", undefined, "支", 250, 11.45, 2863.25, 1517414400000],
  [
    "吸水管组",
    undefined,
    "组",
    60,
    717.948736842105,
    43076.9242105263,
    1517414400000,
  ],
  ["筘座", undefined, "件", 60, 427.3504, 25641.024, 1517414400000],
  ["压布辊", undefined, "件", 80, 277.77775, 22222.22, 1517414400000],
  ["边撑", undefined, "件", 60, 410.2565, 24615.39, 1517414400000],
  [
    "综框",
    undefined,
    "件",
    400,
    184.089399038462,
    73635.7596153846,
    1517414400000,
  ],
]

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
      +new Date(outerDate.replace("年", "-").replace("月", "-") + "1"),
    ])
  }
  fs.readFile("outer.json", "utf8", (err, data) => {
    if (err) return
    // Parse old data
    let obj = JSON.parse(data)
    console.log(outerData)

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

  fileData.forEach((item) => {
    if (!resData.includes(item[0])) {
      resData.push(item[0])
    }
  })
  console.log(resData)
})

router.get("/specifications", async (req, res) => {
  // const { material } = req.param
  const material = "四零堵头"
  const resData = []
  const fileData = JSON.parse(fs.readFileSync("enter.json", "utf8"))
  fileData.forEach((item) => {
    if (item[0] === material && !resData.includes(item[1])) {
      resData.push(item[1])
    }
  })
  console.log(resData)
})

// 有问题
// router.get("/data", async (req, res) => {
// const { material, specifications, year } = req.param
const material = "综框"
const specifications = "280*120*120*1968"
let year = "2024"
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
console.log(targetData)

if (year) {
  targetData = targetData.filter(
    (item) =>
      item[6] >= +new Date(`${year}-01-01`) &&
      item[6] <= +new Date(`${year}-12-31`)
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
    totalNumber += Number(item[4])
    totalPrice += Number(item[5])
  } else {
    totalNumber -= Number(item[4])
    totalPrice -= Number(item[5])
  }
  if (index === targetData.length - 1 || targetData[index + 1][7] !== item[7]) {
    item.push(totalPrice, totalNumber)
  }
})
console.log(sortData)

// 生成Excel尚缺
// })
module.exports = router

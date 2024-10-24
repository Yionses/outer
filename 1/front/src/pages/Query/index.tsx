import { Button, message, Spin, Upload } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import * as XLSX from "xlsx"
import { useState } from "react"

export default function Query() {
  const [data, setData] = useState<any[]>([])
  const beforeUpload = (file: any) => {
    const fileType = file.name.split(".").pop().toLowerCase() // 获取文件扩展名
    const isCsvOrExcel = fileType === "xlsx" || fileType === "xls"

    // 检查文件类型
    if (!isCsvOrExcel) {
      message.error("文件类型不合法，请上传 .xlsx,.xls 文件")
      return false
    }
    const reader = new FileReader()
    reader.onload = (e: any) => {
      const fileContent = e.target.result
      if (fileType === "xls" || fileType === "xlsx") {
        // 如果是 Excel 文件，使用 xlsx 库解析
        const workbook = XLSX?.read(fileContent, { type: "binary" })
        const worksheet = workbook?.Sheets[workbook.SheetNames[0]]
        const excelData = XLSX?.utils?.sheet_to_json(worksheet, { header: 1 })
        // 处理数据
        let i = -1
        const container: any[] = [] // item-单子
        let isNewContainer = false
        // 区分每一张单子
        excelData
          .filter((item: any) => item?.length > 0)
          .forEach((perContainer: any) => {
            isNewContainer = false
            if (perContainer[0]?.includes("有限公司材料入库单")) {
              i++
              isNewContainer = true
            }
            if (isNewContainer) {
              container[i] = []
            }
            container[i]?.push(perContainer)
          })

        // 第一次处理，把数据分割开
        const resultData_1: any[] = []
        i = -1
        container.forEach((paper) => {
          i++
          resultData_1[i] = {
            supplier: "",
            date: "",
            data: [],
          }
          // 供应商和时间
          paper.forEach((item: any) => {
            if (item?.[0]?.includes("供应商")) {
              resultData_1[i]["supplier"] = item[0]
              resultData_1[i]["date"] = item[item.length - 1]
            }
            if (item?.[0] === "") {
              resultData_1[i]?.data?.push(item)
            }
          })
        })

        const resData: any[] = []

        resultData_1.forEach((corporation) => {
          corporation.data.forEach((material: any) => {
            resData.push([
              ...material.filter((item: any) => item != ""),
              corporation.supplier,
              corporation.date,
              +new Date("2023-10-30"),
            ])
          })
        })
        setData(resData)
      }
    }
    // 根据文件类型读取文件内容
    if (fileType === "xlsx" || fileType === "xls") {
      reader.readAsBinaryString(file) // 读取 CSV 文件
    }
    return false
  }
  return (
    <>
      <Upload accept=".xlsx,.xls" beforeUpload={beforeUpload} maxCount={1}>
        <Button icon={<UploadOutlined />}>选择文件</Button>
      </Upload>
      <br />
      <br />
      {data?.length > 0 ? (
        data.map((item, index) => (
          <>
            <div className="flex flex-row justify-start items-center mb-2">
              {/* 有一个是空的，需要解决 */}
              {item
                .filter((_, i) => i <= 6)
                .map((items) => (
                  <span className="w-1/6">{items}</span>
                ))}
            </div>
            {(index === data.length - 1 && item[8]) ||
              (item?.[8] !== data[index + 1][8] && item[8])}
          </>
        ))
      ) : (
        <div>识别失败</div>
      )}
    </>
  )
}

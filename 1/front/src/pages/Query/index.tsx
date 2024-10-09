import { Button, message, Spin, Upload } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import * as XLSX from "xlsx"

export default function Query() {
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
        const workbook = XLSX.read(fileContent, { type: "binary" })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        console.log(excelData.filter((item) => item.length > 0))
      }
    }
    // 根据文件类型读取文件内容
    if (fileType === "xlsx" || fileType === "xls") {
      reader.readAsBinaryString(file) // 读取 CSV 文件
    }
    return false
  }
  return (
    <Upload accept=".xlsx,.xls" beforeUpload={beforeUpload} maxCount={1}>
      <Button icon={<UploadOutlined />}>选择文件</Button>
    </Upload>
  )
}

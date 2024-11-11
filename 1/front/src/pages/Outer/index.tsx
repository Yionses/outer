import { Button, Empty, message, Modal, Space, Upload } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import * as XLSX from "xlsx"
import { useState } from "react"
import { fetchUploadOuterData } from "@/apis/apis"

export default function Outer() {
  const [data, setData] = useState<any[]>([])
  const [isShowModal, setIsShowModal] = useState(false)
  const { mutateAsync } = fetchUploadOuterData()
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
        setData(excelData)
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
      {data.length > 0 ? (
        <Button onClick={() => setData([])}>重新上传</Button>
      ) : (
        <Upload accept=".xlsx,.xls" beforeUpload={beforeUpload} maxCount={1}>
          <Button type="primary" icon={<UploadOutlined />}>
            选择文件
          </Button>
        </Upload>
      )}
      <br />
      <br />
      {data.length > 0 && (
        <div className="flex flex-row justify-start items-center mb-2">
          {["名称", "型号", "单位", "数量", "单价", "金额"].map((item) => (
            <span className="w-1/6 font-bold text-xl">{item}</span>
          ))}
        </div>
      )}
      {data?.length > 0 ? (
        data
          .filter((_, index) => index > 2)
          .map((item) => (
            <>
              <div className="flex flex-row justify-start items-center my-row">
                {item
                  .filter((_, i) => i <= 6)
                  .map((items) => (
                    <span
                      className="w-1/6 py-4"
                      style={{
                        borderColor: "#f0f0f0",
                        borderWidth: ".5px",
                        borderStyle: "solid",
                        borderLeft: "none",
                        borderRight: "none",
                      }}
                    >
                      {items || "无"}
                    </span>
                  ))}
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  textAlign: "right",
                  marginRight: "1rem",
                }}
              ></div>
            </>
          ))
      ) : (
        <Empty description="请上传数据" />
      )}
      <Modal
        open={isShowModal}
        title="上传数据"
        footer={null}
        onCancel={() => setIsShowModal(false)}
      >
        <div className="my-4">请认真核对数据！</div>
        <Space>
          <Button
            type="primary"
            onClick={async () => {
              await mutateAsync({ data } as any)
              message.success("上传成功！")
              setIsShowModal(false)
              setData([])
            }}
          >
            上传
          </Button>
          <Button type="dashed" onClick={() => setIsShowModal(false)}>
            取消
          </Button>
        </Space>
      </Modal>
      <Button
        type="primary"
        disabled={data.length === 0}
        onClick={() => {
          setIsShowModal(true)
        }}
      >
        确定上传
      </Button>
    </>
  )
}

// @ts-nocheck

import { Button, Empty, message, Modal, Space, Upload } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import * as XLSX from "xlsx"
import { useState } from "react"
import "./index.less"
import { fetchUploadData } from "@/apis/apis"

export default function Insert() {
  const [data, setData] = useState<any[]>([])
  const [isShowModal, setIsShowModal] = useState(false)
  const { mutateAsync } = fetchUploadData()
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
            data: []
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
              ...material.filter((_: any, index: any) => index > 0),
              corporation.supplier,
              corporation.date,
              +new Date(corporation.date.replace("制单日期：", ""))
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
          {["名称", "规格", "数量", "单位", "单价", "金额", "税额"].map(
            (item) => (
              <span className="w-1/6 font-bold text-xl">{item}</span>
            )
          )}
        </div>
      )}
      {data?.length > 0 ? (
        data.map((item, index) => (
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
                      borderRight: "none"
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
                marginRight: "1rem"
              }}
            >
              {(index === data.length - 1 && item[8] + "--") ||
                (item?.[8] !== data[index + 1][8] && item[8] + "--")}
              {(index === data.length - 1 && item[9]) ||
                (item?.[8] !== data[index + 1][8] && item[9])}
            </div>
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
              console.log(data)
              await mutateAsync({
                data: data.map((item) => [
                  item[0],
                  item[1] ? item[1] : "无规格",
                  item[2],
                  item[3],
                  item[4],
                  item[5],
                  item[6],
                  item[7],
                  item[8],
                  item[9],
                  item[10]
                ])
              } as any)
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

// @ts-nocheck
import {
  fetchDataDetail,
  fetchMaterial,
  fetchSpecifications
} from "@/apis/apis"
import { Button, DatePicker, Select, Space } from "antd"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import ExcelJS from "exceljs"

export default function YearQuery() {
  const { mutateAsync } = fetchMaterial()
  const { mutateAsync: fetchSpecification } = fetchSpecifications()
  const [materialList, setMaterialList] = useState([])
  const [specificationList, setSpecificationList] = useState([])
  const { mutateAsync: getDataDetail } = fetchDataDetail()
  const [material, setMaterial] = useState("")
  const [specification, setSpecification] = useState("")
  const [data, setData] = useState([])
  const [year, setYear] = useState(new Date().getFullYear())
  async function exportExcel() {
    // 创建一个新的工作簿
    const workbook = new ExcelJS.Workbook()

    // 添加一个名为"My Sheet"的工作表
    const worksheet = workbook.addWorksheet("My Sheet")

    // 添加表头
    worksheet.columns = [
      { header: "类型", key: "type", width: 20 },
      { header: "日期", key: "date", width: 20 },
      { header: "数量", key: "number", width: 20 },
      { header: "单位", key: "unit", width: 20 },
      { header: "单价", key: "price", width: 20 },
      { header: "金额", key: "amount", width: 20 },
      { header: "剩余总数量", key: "remainNumber", width: 20 },
      { header: "剩余总金额", key: "remainAmount", width: 20 }
    ]

    data.forEach((item) => {
      worksheet.addRow({
        type: item[7] + "库",
        date: dayjs(item?.[6]).format("YYYY-MM-DD"),
        number: item[2],
        unit: item[3],
        price: item[4],
        amount: item[5],
        remainNumber: item?.[9] || item[9] == 0 ? item[9] : " ",
        remainAmount: item?.[8] || item[8] == 0 ? item[8] : " "
      })
    })

    // 将工作簿写入buffer
    const buffer = await workbook.xlsx.writeBuffer()

    // 创建Blob对象并触发下载
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${year}年${material}__${specification}详情表.xlsx`
    link.click()
  }
  useEffect(() => {
    console.log(year)
  }, [year])
  useEffect(() => {
    async function getData() {
      const res = (await mutateAsync()) || []
      if (res?.length < 1) {
        return
      }
      const res2 = await fetchSpecification({ material: res?.[0] || "" })
      setMaterialList(res as any)
      setSpecificationList(res2 as any)
      setMaterial(res?.[0] || "")
      setSpecification(res2?.[0] || "无规格")
    }
    getData()
  }, [])
  useEffect(() => {
    async function getData() {
      const res = await fetchSpecification({ material })
      setSpecificationList(res as any)
      setSpecification(res?.[0] || "无规格")
    }
    getData()
  }, [material])
  useEffect(() => {
    async function getData() {
      const res = await getDataDetail({ material, specification, year })
      setData(res as any)
    }
    getData()
  }, [specification, material, year])
  return (
    <>
      <Space>
        <div>
          物料选择：
          <Select
            value={material}
            style={{ width: "200px" }}
            options={materialList.map((item) => ({ label: item, value: item }))}
            onChange={setMaterial}
            showSearch
          />
        </div>
        <div>
          物料规格：
          <Select
            value={specification}
            style={{ width: "200px" }}
            options={specificationList.map((item) => ({
              label: item,
              value: item
            }))}
            onChange={setSpecification}
            showSearch
          />
        </div>
        <div>
          年份：
          <DatePicker
            picker="year"
            onChange={(_, a) => setYear(a)}
            defaultValue={dayjs()}
          />
        </div>
        <Button type="primary" onClick={exportExcel}>
          导出
        </Button>
      </Space>
      <div
        className="my-4 flex flex-row justify-between items-center py-2"
        style={{ borderTop: "2px solid #ccc", borderBottom: "2px solid #ccc" }}
      >
        {[
          "类型",
          "日期",
          "数量",
          "单位",
          "单价",
          "金额",
          "剩余总数量",
          "剩余总金额"
        ].map((item) => {
          return (
            <span className="text-center flex-grow font-bold text-xl w-1/12">
              {item}
            </span>
          )
        })}
      </div>
      <div>
        {data.map((item) => {
          return (
            <div
              className="flex flex-row justify-between items-center my-row py-2"
              style={
                item[7] === "出"
                  ? { backgroundColor: "#f2f2f2", color: "#333333" }
                  : { backgroundColor: "#e6f7ff", color: "#0056b3 " }
              }
            >
              <div className="w-1/12 flex-shrink-0 text-center flex-grow">
                {item[7]}库
              </div>
              <div className="w-1/12 flex-shrink-0 text-center flex-grow">
                {dayjs(item?.[6]).format("YYYY-MM-DD")}
              </div>
              <div className="w-1/12 flex-shrink-0 text-center flex-grow">
                {item[2]}
              </div>
              <div className="w-1/12 flex-shrink-0 text-center flex-grow">
                {item[3]}
              </div>
              <div className="w-1/12 flex-shrink-0 text-center flex-grow">
                {item[4]}
              </div>
              <div className="w-1/12 flex-shrink-0 text-center flex-grow">
                {item[5]}
              </div>
              <div
                className="w-1/12 flex-shrink-0 text-center flex-grow"
                style={{ color: "red" }}
              >
                {item?.[9] || item[9] == 0 ? item[9] : " "}
              </div>
              <div
                className="w-1/12 flex-shrink-0 text-center flex-grow"
                style={{ color: "red" }}
              >
                {item?.[8] || item[8] == 0 ? item[8] : " "}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

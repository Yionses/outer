// @ts-nocheck
import {
  fetchDataDetail,
  fetchMaterial,
  fetchSpecifications
} from "@/apis/apis"
import { Select, Space } from "antd"
import dayjs from "dayjs"
import { useEffect, useState } from "react"

export default function Query() {
  const { mutateAsync } = fetchMaterial()
  const { mutateAsync: fetchSpecification } = fetchSpecifications()
  const [materialList, setMaterialList] = useState([])
  const [specificationList, setSpecificationList] = useState([])
  const { mutateAsync: getDataDetail } = fetchDataDetail()
  const [material, setMaterial] = useState("")
  const [specification, setSpecification] = useState("")
  const [data, setData] = useState([])

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
      const res = await getDataDetail({ material, specification })
      setData(res as any)
    }
    getData()
  }, [specification])
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

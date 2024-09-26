import { useEffect, useState } from "react"
import { shi as allShi, provinces } from "../../data.js"
import { Button, message, Radio, Select, Space, Spin, Upload } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import { fetchQuery } from "@/apis/apis.js"

export default function Query() {
  const [preData, setPreData] = useState([])
  const [isUse, setIsUse] = useState(false)
  const [sheng, setSheng] = useState("hn")
  const [shi, setShi] = useState("郑州")
  const beforeUpload = (file: any) => {
    setPreData([])
    const fileType = file.name.split(".").pop().toLowerCase() // 获取文件扩展名
    const isCsvOrExcel = fileType === "txt"

    // 检查文件类型
    if (!isCsvOrExcel) {
      message.error("文件类型不合法，请上传 .txt 文件")
      return false
    }
    const reader = new FileReader()
    reader.onload = (e: any) => {
      const fileContent = e.target.result

      if (fileType === "txt") {
        setPreData(
          fileContent.split("\r\n").filter((item) => item.length >= 11) || []
        )
      }
    }
    // 根据文件类型读取文件内容
    if (fileType === "txt") {
      reader.readAsText(file) // 读取 CSV 文件
    }
    return false
  }
  const { mutateAsync, isLoading } = fetchQuery()
  const [url, setUrl] = useState("")
  return (
    <Spin spinning={isLoading}>
      <Upload accept=".txt" beforeUpload={beforeUpload} maxCount={1}>
        <Button icon={<UploadOutlined />}>选择文件</Button>
      </Upload>
      <br />
      <Space>
        地区选择：
        <Select
          value={sheng}
          onChange={(value) => {
            setSheng(value)
            setShi(allShi[value][0])
          }}
          style={{ width: 120 }}
        >
          {Object.keys(provinces).map((key) => {
            return (
              <Select.Option key={key} value={key}>
                {provinces[key]}
              </Select.Option>
            )
          })}
        </Select>
        <Select value={shi} onChange={setShi} style={{ width: 200 }}>
          {allShi[sheng].map((key) => {
            return (
              <Select.Option key={key} value={key}>
                {key}
              </Select.Option>
            )
          })}
        </Select>
      </Space>
      <br />
      <br />
      <br />
      <Space>
        是否经过需要查询实号：
        <Radio.Group value={isUse} onChange={(e) => setIsUse(e.target.value)}>
          <Radio value={true}>是</Radio>
          <Radio value={false}>否</Radio>
        </Radio.Group>
      </Space>
      <br />
      <br />
      <br />
      <br />
      <p style={{ fontWeight: 700, margin: "10px 0" }}>
        待查询号码：
        {preData.length === 0 && <span>请上传文件</span>}
      </p>
      <div className="flex-wrap justify-start" style={{ display: "flex" }}>
        {preData.map((item) => {
          return <p style={{ width: "150px" }}>{item}</p>
        })}
      </div>
      {preData.length != 0 && (
        <p style={{ margin: "10px 0" }}>
          共计查询号码
          <span style={{ fontWeight: 700, color: "red", margin: "0 10px" }}>
            {preData.length}
          </span>
          个
        </p>
      )}
      <br />
      <br />
      <Button
        type="primary"
        disabled={preData.length === 0}
        onClick={async () => {
          const res = await mutateAsync({
            phones: preData,
            shi: provinces[sheng] + shi,
            isUse,
          })
          setUrl(`http://101.200.13.5:3000/${res.fileName.replace("./", "")}`)
        }}
      >
        查询
      </Button>
      <br />
      <br />
      {url && (
        <span>
          单击链接下载结果：<a href={url}>{url}</a>
        </span>
      )}
    </Spin>
  )
}

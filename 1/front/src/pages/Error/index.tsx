import { Button, Empty } from "antd"
import { useNavigate } from "react-router-dom"

export default function ErrorPage() {
  const navigate = useNavigate()
  return (
    <>
      <Empty description="当前页面不存在" />
      <Button type="primary" onClick={() => navigate("/home/index")}>
        返回首页
      </Button>
    </>
  )
}

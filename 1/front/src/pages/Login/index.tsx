import { Button, Form, Input, message } from "antd"
import "./index.less"
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { useForm } from "antd/es/form/Form"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { UserStatus } from "@/Contexts/UserStatus"
import CryptoJS from "crypto-js"
import { post } from "@/apis"

export default function Login() {
  const [form] = useForm()
  const navigate = useNavigate()
  const { setUserType, setIsLoing, setUserInfo } = useContext(UserStatus)
  return (
    <div className="box relative" style={{ width: "100vw", height: "100vh" }}>
      <div
        className="absolute top-1/2 left-1/2 h-96 w-96 "
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <h1 className="text-center"> {import.meta.env.VITE_TITLE}</h1>
        <Form
          className="mt-8"
          form={form}
          onFinish={async () => {
            const { username, password } = form.getFieldsValue()
            const pass = CryptoJS.SHA512(password).toString()
            const res = await post("/user/login", {
              account: username,
              password: pass,
            })
            if (res) {
              setIsLoing(true)
              setUserInfo(res)
              navigate("/home/query")
            }
          }}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "请输入账号" },
              { required: true, max: 8, message: "最长为8位" },
              { required: true, min: 5, message: "最短为5位" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入账号" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, max: 11, message: "最长为11位" },
              { required: true, min: 11, message: "最短为11位" },
            ]}
          >
            <Input
              type="password"
              prefix={<LockOutlined />}
              placeholder="请输入11位密码"
              maxLength={11}
              minLength={11}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

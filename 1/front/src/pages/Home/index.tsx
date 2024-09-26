import React, { useContext, useState } from "react"
import { Button, Card, Layout, Menu, message, theme } from "antd"
import logo from "@public/icon.ico"
import { Outlet, useNavigate } from "react-router-dom"
import { routes } from "@/routes"
import { UserStatus } from "@/Contexts/UserStatus"

const { Header, Content, Sider } = Layout

const getSelectKeys = () => {
  if (location.pathname === "/home/index") {
    return ["home"]
  } else {
    return location.pathname.replace("/home", "").split("/")
  }
}

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [isShowTitle, setIsShowTitle] = useState(true)
  const [title, setTitle] = useState("主页")
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const navigate = useNavigate()
  const { userType } = useContext(UserStatus)

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => {
          setCollapsed(value)
          setIsShowTitle(!isShowTitle)
        }}
      >
        <div className="demo-logo-vertical flex flex-row my-4 box-border justify-center w-4/5 mx-auto">
          <img src={logo} className="w-7 h-7" />
          {isShowTitle && (
            <p
              className="h-7 text-center pl-4"
              style={{ lineHeight: "28px", color: "white" }}
            >
              {import.meta.env.VITE_TITLE}
            </p>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={getSelectKeys()}
          defaultOpenKeys={getSelectKeys()}
          items={
            userType === "admin"
              ? routes
              : routes.filter((route) => route.key !== "manager")
          }
          onClick={({ keyPath, domEvent }: any) => {
            let path: string = "/home"
            for (let i = keyPath.length; i > 0; i--) {
              if (keyPath[i - 1] === "home") {
                path += "/index"
                break
              }
              path += `/${keyPath[i - 1]}`
            }
            setTitle(domEvent.target.innerText)
            navigate(path)
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className="flex justify-between items-center">
            <h2 className="pl-6">{title}</h2>
            <Button
              type="link"
              onClick={() => {
                navigate("/")
                message.warning("退出成功!")
              }}
              className="mr-10"
            >
              退出登录
            </Button>
          </div>
        </Header>
        <Content style={{ margin: "16px" }}>
          <Card style={{ height: "100%" }}>
            <Outlet />
          </Card>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App

import { UserStatus } from "@/Contexts/UserStatus"
import { message } from "antd"
import { useContext } from "react"
import { Navigate } from "react-router-dom"

export default function Limit(props: any) {
  const { isLogin } = useContext(UserStatus)
  if (!isLogin) {
    message.error("请重新登录!")
  }
  return <>{isLogin ? props.children : <Navigate to="/"></Navigate>}</>
}

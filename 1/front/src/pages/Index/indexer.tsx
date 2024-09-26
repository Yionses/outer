import { UserStatus } from "@/Contexts/UserStatus"
import { useContext } from "react"

export default function Indexer() {
  const { userinfo } = useContext(UserStatus)

  return (
    <>
      <p className="text-center">姓名：{userinfo?.username}</p>
      <p className="text-center">账号：{userinfo?.account}</p>
    </>
  )
}

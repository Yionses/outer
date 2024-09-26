import { Dispatch, SetStateAction, createContext, useState } from "react"

export interface LoginTabProps {
  userType: string
  setUserType: Dispatch<SetStateAction<string>>
  isLogin: boolean
  setIsLoing: Dispatch<SetStateAction<boolean>>
  userinfo: any
  setUserInfo: Dispatch<SetStateAction<any>>
}
export const UserStatus = createContext<LoginTabProps>({} as any)

export function UserStatusProvider(props: any) {
  const [userType, setUserType] = useState<string>("")
  const [isLogin, setIsLoing] = useState<boolean>(false)
  const [userinfo, setUserInfo] = useState<any>({})
  return (
    <UserStatus.Provider
      value={{
        userType,
        setUserType,
        isLogin,
        setIsLoing,
        userinfo,
        setUserInfo,
      }}
    >
      {props.children}
    </UserStatus.Provider>
  )
}

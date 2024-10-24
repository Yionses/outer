import {
  HomeOutlined,
  SearchOutlined,
  UploadOutlined,
  LogoutOutlined,
} from "@ant-design/icons"
import type { MenuProps } from "antd"
type MenuItem = Required<MenuProps>["items"][number]

/**
 * 这里要和APP.tsx中的路由对象，记得放路由出口
 */

export const routes: MenuItem[] = [
  // {
  //   label: "主页",
  //   icon: <HomeOutlined />,
  //   key: "home",
  // },
  {
    label: "入库记录",
    icon: <UploadOutlined />,
    key: "insert",
  },
  {
    label: "出库记录",
    icon: <LogoutOutlined />,
    key: "outer",
  },
  {
    label: "库存查询",
    icon: <SearchOutlined />,
    key: "query",
  },
]

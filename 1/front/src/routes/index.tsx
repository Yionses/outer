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
    label: "库存查询",
    icon: <SearchOutlined />,
    key: "query",
  },
  {
    label: "年报表查询",
    icon: <SearchOutlined />,
    key: "yearQuery",
  },
  {
    label: "物料入库",
    icon: <UploadOutlined />,
    key: "insert",
  },
  {
    label: "物料出库",
    icon: <LogoutOutlined />,
    key: "outer",
  },
]

import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";
import {
  Avatar,
  Badge,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Space,
  theme,
} from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import Icon, { BellFilled } from "@ant-design/icons";
import { useState } from "react";
import Logo from "../components/icons/Logo";
import Home from "../components/icons/Home";
import GiftIcon from "../components/icons/GiftIcon";
import BasketIcon from "../components/icons/BasketIcon";
import { foodIcon } from "../components/icons/FoodIcon";
import UserIcon from "../components/icons/UserIcon";
import { useLogout } from "../hooks/useLogout";

const getMenuItems = (role: string) => {
  const baseItems = [
    {
      key: "/",
      icon: <Icon component={Home} />,
      label: <NavLink to={"/"}>Home</NavLink>,
    },

    {
      key: "/products",
      icon: <Icon component={BasketIcon} />,
      label: <NavLink to={"/products"}>Products</NavLink>,
    },
    {
      key: "/promos",
      icon: <Icon component={GiftIcon} />,
      label: <NavLink to={"/promos"}>Promos</NavLink>,
    },
  ];
  if (role === "admin") {
    const menus = [...baseItems];
    menus.splice(1, 0, {
      key: "/users",
      icon: <Icon component={UserIcon} />,
      label: <NavLink to={"/users"}>Users</NavLink>,
    });
    menus.splice(2, 0, {
      key: "/restaurants",
      icon: <Icon component={foodIcon} />,
      label: <NavLink to={"/restaurants"}>Restaurants</NavLink>,
    });

    return menus;
  }
  return baseItems;
};

const Dashboard = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const items = getMenuItems(user?.role as string);
  const { logout } = useLogout();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  if (user === null) {
    return (
      <Navigate
        to={`/auth/login?returnTo=${location.pathname}`}
        replace={true}
      />
    );
  }

  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="logo">
            <Logo />
          </div>
          <Menu
            theme="light"
            defaultSelectedKeys={[location.pathname]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              paddingLeft: "60px",
              paddingRight: "60px",
              background: colorBgContainer,
            }}
          >
            <Flex gap="middle" align="start" justify="space-between">
              <Badge
                text={
                  user.role === "admin"
                    ? "You are an admin"
                    : user?.tenant?.name
                }
                status="success"
              />
              <Space size={16}>
                <Badge dot={true}>
                  <BellFilled />
                </Badge>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "logout",
                        label: "Logout",
                        onClick: () => logout(),
                      },
                    ],
                  }}
                  placement="bottomRight"
                >
                  <Avatar
                    style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
                  >
                    U
                  </Avatar>
                </Dropdown>
              </Space>
            </Flex>
          </Header>
          <Content style={{ margin: "24px" }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Pizza Shop ©{new Date().getFullYear()} Created by Akshay Thummar
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default Dashboard;

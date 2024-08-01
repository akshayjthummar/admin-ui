import { Breadcrumb, Button, Drawer, Space, Table } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../http/api";
import { User } from "../../types";
import { useAuthStore } from "../../store";
import UserFilters from "./UserFilters";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

const columns = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "firstName",
    key: "firstName",
    render: (_text: string, record: User) => {
      return (
        <div>
          {record.firstName} {record.lastName}
        </div>
      );
    },
  },

  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
];

const UserPagae = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await getUsers().then((res) => res.data);
    },
  });

  const { user } = useAuthStore();
  if (user?.role !== "admin") {
    return <Navigate to={"/"} replace={true} />;
  }
  return (
    <>
      <Space size={"large"} style={{ width: "100%" }} direction="vertical">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to={"/dashboard"}>Dashboard</Link> },
            { title: "Users" },
          ]}
        />
        {isLoading && <div>Loading...</div>}
        {isError && <div>{error.message}</div>}
        <UserFilters
          onFilterChange={(filterName, filterValue) => {
            console.log(filterName);
            console.log(filterValue);
          }}
        >
          <Button
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
            type="primary"
          >
            Add User
          </Button>
        </UserFilters>
        <Table columns={columns} dataSource={users} rowKey={"id"} />

        <Drawer
          title={"Create User"}
          width={720}
          destroyOnClose
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
          }}
          extra={
            <Space>
              <Button onClick={() => setDrawerOpen(true)}>Cancel</Button>
              <Button type="primary">Submit</Button>
            </Space>
          }
        >
          <p>Something...</p>
          <p>Something...</p>
        </Drawer>
      </Space>
    </>
  );
};

export default UserPagae;

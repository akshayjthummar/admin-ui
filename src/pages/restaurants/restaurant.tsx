import { Breadcrumb, Button, Col, Drawer, Space, Table } from "antd";
import { RightOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getRestaurants } from "../../http/api";
import RestaurantFilter from "./restaurantFilter";
import { useState } from "react";

const colums = [
  {
    title: "Id",
    id: "id",
    dataIndex: "id",
  },
  {
    title: "Name",
    id: "name",
    dataIndex: "name",
  },
  {
    title: "Address",
    id: "address",
    dataIndex: "address",
  },
];

const Restuarant = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      return await getRestaurants().then((res) => res.data);
    },
  });

  return (
    <Space style={{ width: "100%" }} direction="vertical">
      <Breadcrumb
        separator={<RightOutlined />}
        items={[
          { title: <Link to={"/dashboard"}>Dashboard</Link> },
          { title: "Restaurants" },
        ]}
      />
      <RestaurantFilter
        onFilterChange={(filterName, filterValue) => {
          console.log(filterName, filterValue);
        }}
      >
        <Button
          type="primary"
          onClick={() => setDrawerOpen(true)}
          icon={<PlusOutlined />}
        >
          Add Restaurant
        </Button>
      </RestaurantFilter>
      <Table columns={colums} dataSource={restaurants} rowKey={"id"} />
      <Drawer
        width={720}
        open={drawerOpen}
        title="Craete Restaurant"
        destroyOnClose
        onClose={() => {
          setDrawerOpen(false);
        }}
        extra={
          <Space>
            <Button>Cancel</Button>
            <Button type="primary">Submit</Button>
          </Space>
        }
      >
        <Col>Something</Col>
        <Col>Something</Col>
      </Drawer>
    </Space>
  );
};

export default Restuarant;

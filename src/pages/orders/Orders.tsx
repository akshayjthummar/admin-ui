import { Breadcrumb, Flex, Space, Table, Tag, Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Order } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../http/api";
import { useState } from "react";
import { format } from "date-fns";
import { colorMapping } from "../../constant";
import { capitalizeFristLatter } from "../products/helpers";

const columns = [
  {
    title: "Order ID",
    dataIndex: "_id",
    key: "_id",
    render: (_text: string, record: Order) => {
      return <Typography.Text>{record._id}</Typography.Text>;
    },
  },
  {
    title: "Customer",
    dataIndex: "customerId",
    key: "customerId._id",
    render: (_text: string, record: Order) => {
      const customer = record.customer;
      if (!customer) return "-";
      return (
        <Typography.Text>
          {customer.firstName + " " + customer.lastName}
        </Typography.Text>
      );
    },
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    render: (_text: string, record: Order) => {
      return <Typography.Text>{record.address}</Typography.Text>;
    },
  },
  {
    title: "Comment",
    dataIndex: "comment",
    key: "comment",
    render: (_text: string, record: Order) => {
      return <Typography.Text>{record?.comment}</Typography.Text>;
    },
  },
  {
    title: "Payment Mode",
    dataIndex: "paymentMode",
    key: "paymentMode",
    render: (_text: string, record: Order) => {
      return <Typography.Text>{record.paymentMode}</Typography.Text>;
    },
  },
  {
    title: "Status",
    dataIndex: "orderStatus",
    key: "orderStatus",
    render: (_text: string, record: Order) => {
      return (
        <Tag bordered={false} color={colorMapping[record.orderStatus]}>
          {capitalizeFristLatter(record.orderStatus)}
        </Tag>
      );
    },
  },
  {
    title: "Total",
    dataIndex: "totalAmount",
    key: "totalAmount",
    render: (text: string) => {
      return <Typography.Text>₹{text}</Typography.Text>;
    },
  },
  {
    title: "CreatedAt",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => {
      return (
        <Typography.Text>
          {format(new Date(text), "dd/MM/yyyy HH:mm")}
        </Typography.Text>
      );
    },
  },
  {
    title: "Actions",
    render: (_: string, record: Order) => {
      return (
        <Link to={`/orders/${record._id}`} className="underline">
          Details
        </Link>
      );
    },
  },
];

const TENANTID = 3;
const Orders = () => {
  const [page, setPage] = useState(1);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", page, TENANTID],
    queryFn: async () => {
      const queryString = new URLSearchParams({
        tenantId: String(TENANTID),
        page: String(page),
      }).toString();
      return await getOrders(queryString).then((res) => res.data);
    },
  });

  return (
    <Space size={"large"} direction="vertical" style={{ width: "100%" }}>
      <Flex justify="space-between">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to={"/dashboard"}>Dashboard</Link> },
            { title: "Orders" },
          ]}
        />
      </Flex>
      <Table
        columns={columns}
        rowKey={"_id"}
        dataSource={orders?.data || []}
        loading={isLoading}
        pagination={{
          total: orders?.totalDocs,
          current: orders?.page,
          pageSize: orders?.limit,
          onChange: (page) => setPage(page),
        }}
      />
    </Space>
  );
};

export default Orders;

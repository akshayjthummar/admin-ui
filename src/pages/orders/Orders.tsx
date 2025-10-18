import { Breadcrumb, Flex, Select, Space, Table, Tag, Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Order, Tenant } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { getOrders, getRestaurants } from "../../http/api";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { colorMapping } from "../../constant";
import { capitalizeFristLatter } from "../products/helpers";
import { useAuthStore } from "../../store";
import socket from "../../lib/socket";

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

const Orders = () => {
  const [page, setPage] = useState(1);
  const [tenantId, setTenantId] = useState("");
  const { user } = useAuthStore();

  useEffect(() => {
    const handleUpdate = (data: any) => {
      console.log("🔥 data received", data);
    };

    const handleJoin = (data: any) => {
      console.log("✅ user joined room:", data.roomId);
    };

    socket.on("update-order", handleUpdate);
    socket.on("join", handleJoin);

    // Wait until user is ready, then join
    if (user?.tenant?.id) {
      console.log("📡 joining room with tenantId:", user.tenant.id);
      socket.emit("join", { tenantId: user.tenant.id });
    } else {
      console.warn("⚠️ tenantId not ready yet");
    }

    return () => {
      socket.off("join", handleJoin);
      socket.off("update-order", handleUpdate);
    };
  }, [user?.tenant?.id]);

  // useEffect(() => {
  //   socket.on("update-order", (data) => {
  //     console.log("data recived", data);
  //   });
  //   if (user?.tenant) {
  //     socket.on("join", (data) => {
  //       console.log("user joined", data.roomId);
  //     });
  //     socket.emit("join", {
  //       tenantId: user.tenant.id,
  //     });
  //   }
  //   return () => {
  //     socket.off("join");
  //     socket.off("update-order");
  //   };
  // }, []);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", page, tenantId],
    queryFn: async () => {
      const queryString = new URLSearchParams({
        tenantId: String(tenantId),
        page: String(page),
      }).toString();
      return await getOrders(queryString).then((res) => res.data);
    },
  });

  const { data: restaurent } = useQuery({
    queryKey: ["restaurent"],
    queryFn: () => {
      return getRestaurants(`perPage=100&currentPage=1`);
    },
  });

  const handleChange = (tenantId: string) => {
    setTenantId(tenantId);
    return;
  };

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
      {user?.role === "admin" && (
        <Flex align="center" gap={20}>
          <Select
            allowClear={true}
            placeholder="Select restaurent"
            onChange={handleChange}
          >
            {restaurent?.data.data.map((tenant: Tenant) => {
              return (
                <Select.Option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </Select.Option>
              );
            })}
          </Select>
        </Flex>
      )}
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

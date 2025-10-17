import {
  Avatar,
  Breadcrumb,
  Card,
  Col,
  Flex,
  List,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import { Link, useParams } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { colorMapping } from "../../constant";
import { capitalizeFristLatter } from "../products/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changeStatus, getSingleOrder } from "../../http/api";
import { Order, OrderStatus, Topping } from "../../types";
import { format } from "date-fns";

const SingleOrder = () => {
  const { orderId } = useParams();
  const { data: order } = useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const queryString = new URLSearchParams({
        fields:
          "cart,address,customerId,paymentMode,tenantId,totalAmount,comment,orderStatus,paymentStatus,createdAt",
      }).toString();
      return await getSingleOrder(orderId as string, queryString).then(
        (res) => res.data
      );
    },
  });
  const orderStatusOptions = [
    { label: "Received", value: OrderStatus.RECEIVED },
    { label: "Confrimed", value: OrderStatus.CONFRIMED },
    { label: "Prepared", value: OrderStatus.PREPARED },
    { label: "Out For Delivery", value: OrderStatus.OUT_FOR_DELIVERY },
    { label: "Delivered", value: OrderStatus.DELIVERED },
  ];

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ["order", orderId],
    mutationFn: async (status: OrderStatus) => {
      return await changeStatus(orderId as string, { status }).then(
        (res) => res.data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
  });
  const handleStatusChange = (status: OrderStatus) => {
    mutate(status);
    console.log(status);
  };

  if (!order) {
    return null;
  }

  return (
    <Space size={"large"} direction="vertical" style={{ width: "100%" }}>
      <Flex justify="space-between">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to={"/"}>Dashboard</Link> },
            { title: <Link to={"/orders"}>Orders</Link> },
            { title: `Order #${order?._id}` },
          ]}
        />
        <Space>
          <Typography.Text>Change Order Status</Typography.Text>
          <Select
            defaultValue={order.orderStatus}
            style={{ width: 150 }}
            onChange={handleStatusChange}
            options={orderStatusOptions}
          />
        </Space>
      </Flex>
      <Row gutter={24}>
        <Col span={14}>
          <Card
            title="Order Details"
            extra={
              <Tag
                bordered={false}
                color={colorMapping[order?.orderStatus] ?? "processing"}
              >
                {capitalizeFristLatter(order?.orderStatus)}
              </Tag>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={order.cart}
              renderItem={(item, _index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.image} />}
                    title={item.name}
                    description={
                      item?.chosenConfiguration?.selectedToppings?.length
                        ? item.chosenConfiguration.selectedToppings
                            .map((topping: Topping) => topping.name)
                            .join(", ")
                        : "No toppings"
                    }
                  />
                  <Space size={"large"}>
                    <Typography.Text>
                      {Object.values(
                        item?.chosenConfiguration?.priceConfiguration
                      ).join(", ")}
                    </Typography.Text>
                    <Typography.Text>
                      {item.qty} Item{item.qty > 1 ? "s" : ""}
                    </Typography.Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={10}>
          <Card title="Customer Details">
            <Space direction="vertical">
              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">Name</Typography.Text>
                <Typography.Text>
                  {order.customerId
                    ? `${order.customerId.firstName} ${order.customerId.lastName}`
                    : "Unknown Customer"}
                </Typography.Text>{" "}
              </Flex>
              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">Address</Typography.Text>
                <Typography.Text>{order.address}</Typography.Text>
              </Flex>
              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">
                  Payment Method
                </Typography.Text>
                <Typography.Text>
                  {order.paymentMode.toUpperCase()}
                </Typography.Text>
              </Flex>
              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">
                  Payment Status
                </Typography.Text>
                <Typography.Text>
                  {capitalizeFristLatter(order.paymentStatus)}
                </Typography.Text>
              </Flex>
              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">Order Amount</Typography.Text>
                <Typography.Text>₹{order.totalAmount}</Typography.Text>
              </Flex>
              <Flex style={{ flexDirection: "column" }}>
                <Typography.Text type="secondary">Order Time</Typography.Text>
                <Typography.Text>
                  {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
                </Typography.Text>
              </Flex>
              {order.comment && (
                <Flex style={{ flexDirection: "column" }}>
                  <Typography.Text type="secondary">Comment</Typography.Text>
                  <Typography.Text>{order.comment}</Typography.Text>
                </Flex>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default SingleOrder;

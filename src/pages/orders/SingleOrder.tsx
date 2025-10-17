import {
  Avatar,
  Breadcrumb,
  Card,
  Col,
  Flex,
  List,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { Link, useParams } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { colorMapping } from "../../constant";
import { capitalizeFristLatter } from "../products/helpers";
import { useQuery } from "@tanstack/react-query";
import { getSingleOrder } from "../../http/api";
import { Order, Topping } from "../../types";

const SingleOrder = () => {
  const { orderId } = useParams();
  const { data: order } = useQuery<Order>({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      const queryString = new URLSearchParams({
        fields:
          "cart,address,paymentMode,tenantId,totalAmount,comment,orderStatus,paymentStatus",
      }).toString();
      return await getSingleOrder(orderId as string, queryString).then(
        (res) => res.data
      );
    },
  });

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
              renderItem={(item, index) => (
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
          <Card title="Customer Details">customer details ...</Card>
        </Col>
      </Row>
    </Space>
  );
};

export default SingleOrder;

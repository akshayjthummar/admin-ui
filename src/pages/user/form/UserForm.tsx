import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space } from "antd";
import { getRestaurants } from "../../../http/api";
import { Tenant } from "../../../types";

const UserForm = () => {
  const { data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      return await getRestaurants().then((res) => res.data);
    },
  });
  console.log(restaurants);

  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Card title="Basic info">
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item label="First name" name="firstName">
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Last name" name="lastName">
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Col span={12}>
              <Form.Item label="Email" name="email">
                <Input size="large" />
              </Form.Item>
            </Col>
          </Card>
          <Card title="Security info">
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item label="Password" name="password">
                  <Input size="large" type="password" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="Roles info">
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item label="Role" name={"role"}>
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    allowClear={true}
                    placeholder="Select role"
                  >
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="manager">Manager</Select.Option>
                    <Select.Option value="customer">Customer</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Restaurant" name={"tenantId"}>
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    allowClear={true}
                    placeholder="Select restaurant"
                  >
                    {restaurants &&
                      restaurants.map((restaurant: Tenant) => {
                        return (
                          <Select.Option value={restaurant?.id}>
                            {restaurant?.name}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default UserForm;

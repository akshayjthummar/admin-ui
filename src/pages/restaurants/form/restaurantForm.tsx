import { Card, Col, Form, Input, Row } from "antd";

const RestaurantForm = () => {
  return (
    <Card title="Restaurant info">
      <Row>
        <Col span={14}>
          <Form.Item
            label="Restaurant name"
            name={"name"}
            rules={[
              {
                required: true,
                message: "Name is required",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={14}>
          <Form.Item
            label="Restaurant address"
            name={"address"}
            rules={[
              {
                required: true,
                message: "Address is required",
              },
            ]}
          >
            <Input title="Address" />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default RestaurantForm;

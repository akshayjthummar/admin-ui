import { Card, Col, Form, Input, Row } from "antd";

const UserForm = () => {
  return (
    <Row>
      <Col span={24}>
        <Card title="Basic info">
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item label="First name" name="firstName">
                <Input placeholder="First name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Last name" name="lastName">
                <Input placeholder="Last name" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default UserForm;

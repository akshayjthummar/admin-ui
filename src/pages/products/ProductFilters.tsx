import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";

interface ProductFiltersProps {
  children?: React.ReactNode;
}
const ProductFilters = ({ children }: ProductFiltersProps) => {
  return (
    <Card>
      <Row justify="space-between">
        <Col span={16}>
          {" "}
          <Row gutter={20}>
            <Col span={6}>
              <Form.Item name="q">
                <Input.Search allowClear={true} placeholder="Search" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="role">
                <Select
                  style={{ width: "100%" }}
                  allowClear={true}
                  placeholder="Select category"
                >
                  <Select.Option value="pizza">Pizza</Select.Option>
                  <Select.Option value="baverage">baverage</Select.Option>
                  <Select.Option value="topping">topping</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="role">
                <Select
                  style={{ width: "100%" }}
                  allowClear={true}
                  placeholder="Select Restourant"
                >
                  <Select.Option value="pizza">Pizza Hub</Select.Option>
                  <Select.Option value="baverage">Shpty corner</Select.Option>
                  <Select.Option value="topping">topping</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Space>
                <Switch defaultChecked onChange={() => {}} />
                <Typography.Text>Show only published</Typography.Text>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={8} style={{ display: "flex", justifyContent: "end" }}>
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default ProductFilters;

import { useQuery } from "@tanstack/react-query";
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
import { getCategories, getRestaurants } from "../../http/api";
import { Tenant, useAuthStore } from "../../store";
import { Category } from "../../types";

interface ProductFiltersProps {
  children?: React.ReactNode;
}
const ProductFilters = ({ children }: ProductFiltersProps) => {
  const { data: restaurent } = useQuery({
    queryKey: ["restaurent"],
    queryFn: () => {
      return getRestaurants(`perPage=100&currentPage=1`);
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return getCategories();
    },
  });
  const { user } = useAuthStore();

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
              <Form.Item name="categoryId">
                <Select
                  style={{ width: "100%" }}
                  allowClear={true}
                  placeholder="Select category"
                >
                  {categories?.data.map((category: Category) => {
                    return (
                      <Select.Option key={category._id} value={category._id}>
                        {category.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            {user?.role === "admin" && (
              <Col span={6}>
                <Form.Item name="tenantId">
                  <Select
                    style={{ width: "100%" }}
                    allowClear={true}
                    placeholder="Select Restaurent"
                  >
                    {restaurent?.data.data.map((restaurant: Tenant) => {
                      return (
                        <Select.Option
                          key={restaurant.id}
                          value={restaurant.id}
                        >
                          {restaurant.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            )}

            <Col span={6}>
              <Space>
                <Form.Item name="isPublish">
                  <Switch defaultChecked={false} onChange={() => {}} />
                </Form.Item>
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

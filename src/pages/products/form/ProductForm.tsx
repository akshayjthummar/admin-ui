import {
  Card,
  Col,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import { Category } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getRestaurants } from "../../../http/api";
import { Tenant, useAuthStore } from "../../../store";
import Pricing from "./Pricing";
import Attributes from "./Attributes";
import ProductImage from "./ProductImage";

const ProductForm = ({ form }: { form: FormInstance }) => {
  const selectedCategory = Form.useWatch("categoryId");
  const { user } = useAuthStore();
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return getCategories();
    },
  });
  const { data: restaurent } = useQuery({
    queryKey: ["restaurent"],
    queryFn: () => {
      return getRestaurants(`perPage=100&currentPage=1`);
    },
  });

  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Card title="Product info">
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item
                  label="Product name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Product name is required",
                    },
                  ]}
                >
                  <Input size="large" placeholder="Product Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Category"
                  name="categoryId"
                  rules={[
                    {
                      required: true,
                      message: "Category name is required",
                    },
                  ]}
                >
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    allowClear={true}
                    placeholder="Select Category"
                  >
                    {categories?.data.map((category: Category) => (
                      <Select.Option value={category._id} key={category._id}>
                        {category.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Col span={24}>
              <Form.Item
                label="Product Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Description is not valid",
                  },
                ]}
              >
                <Input.TextArea
                  rows={2}
                  maxLength={100}
                  size="large"
                  placeholder="Product Description"
                />
              </Form.Item>
            </Col>
          </Card>

          <Card title="Product Image">
            <Col span={12}>
              <ProductImage initailImage={form.getFieldValue("image")} />
            </Col>
          </Card>

          {user?.role !== "manager" && (
            <Card title="Restaurent info">
              <Col span={24}>
                <Form.Item
                  label="Restaurant"
                  name={"tenantId"}
                  rules={[
                    {
                      required: true,
                      message: "Restaurant is required",
                    },
                  ]}
                >
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    allowClear={true}
                    placeholder="Select restaurant"
                  >
                    {restaurent?.data.data.map((restaurant: Tenant) => (
                      <Select.Option
                        value={String(restaurant.id)}
                        key={restaurant.id}
                      >
                        {restaurant.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Card>
          )}

          {selectedCategory && <Pricing selectedCategory={selectedCategory} />}
          {selectedCategory && (
            <Attributes selectedCategory={selectedCategory} />
          )}

          <Card title="Other Properties">
            <Row gutter={10}>
              <Col span={24}>
                <Space>
                  <Form.Item name="isPublish">
                    <Switch
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                      defaultChecked={false}
                      onChange={() => {}}
                    />
                  </Form.Item>
                  <Typography.Text
                    style={{ marginBottom: 20, display: "block" }}
                  >
                    published
                  </Typography.Text>
                </Space>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default ProductForm;

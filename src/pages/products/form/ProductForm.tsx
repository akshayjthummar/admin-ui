import {
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Switch,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import { Category } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getRestaurants } from "../../../http/api";
import { PlusOutlined } from "@ant-design/icons";
import { Tenant } from "../../../store";
import Pricing from "./Pricing";
import Attributes from "./Attributes";
import { useState } from "react";

const ProductForm = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const selectedCategory = Form.useWatch("categoryId");
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
  const uploadConfig: UploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpegorPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpegorPng) {
        messageApi.error("You can only upload JPEG/PNG file");
      }
      setImageUrl(URL.createObjectURL(file));
      return false;
    },
  };
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
                      <Select.Option
                        value={JSON.stringify(category)}
                        key={category._id}
                      >
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
              <Form.Item
                label=""
                name="image"
                rules={[
                  {
                    required: true,
                    message: "Please upload a product image",
                  },
                ]}
              >
                {contextHolder}
                <Upload listType="picture-card" {...uploadConfig}>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{ width: "100%" }}
                    />
                  ) : (
                    <Space direction="vertical">
                      <PlusOutlined />
                      <Typography.Text>Upload</Typography.Text>
                    </Space>
                  )}
                </Upload>
              </Form.Item>
            </Col>
          </Card>

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
                    <Select.Option value={restaurant.id} key={restaurant.id}>
                      {restaurant.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Card>

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

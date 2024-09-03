import { Breadcrumb, Button, Flex, Space, Form } from "antd";
import { Link } from "react-router-dom";
import { RightOutlined, PlusOutlined } from "@ant-design/icons";
import ProductFilters from "./ProductFilters";

const Products = () => {
  const [filterForm] = Form.useForm();

  return (
    <>
      <Space size={"large"} style={{ width: "100%" }} direction="vertical">
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to={"/dashboard"}>Dashboard</Link> },
              { title: "Products" },
            ]}
          />
        </Flex>
        <Form form={filterForm} onFieldsChange={() => {}}>
          <ProductFilters>
            <Button icon={<PlusOutlined />} onClick={() => {}} type="primary">
              Add Product
            </Button>
          </ProductFilters>
        </Form>
      </Space>
    </>
  );
};

export default Products;

import { Breadcrumb, Flex, Space } from "antd";
import { Link } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";

const Products = () => {
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
      </Space>
    </>
  );
};

export default Products;

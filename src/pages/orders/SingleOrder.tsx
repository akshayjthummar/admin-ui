import { Breadcrumb, Flex, Space } from "antd";
import { Link } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";

const SingleOrder = () => {
  return (
    <Space size={"large"} direction="vertical" style={{ width: "100%" }}>
      <Flex justify="space-between">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to={"/"}>Dashboard</Link> },
            { title: <Link to={"/orders"}>Orders</Link> },
            { title: `Order #19349r0r0-r33r-` },
          ]}
        />
      </Flex>
    </Space>
  );
};

export default SingleOrder;

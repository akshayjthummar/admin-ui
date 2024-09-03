import {
  Breadcrumb,
  Button,
  Flex,
  Space,
  Form,
  Table,
  Image,
  Typography,
  Tag,
} from "antd";
import { Link } from "react-router-dom";
import { RightOutlined, PlusOutlined } from "@ant-design/icons";
import ProductFilters from "./ProductFilters";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PER_PAGE } from "../../constant";
import { getProducts } from "../../http/api";
import { Product } from "../../types";
import { format } from "date-fns";

const columns = [
  {
    title: "Product Name",
    dataIndex: "name",
    key: "name",
    render: (_text: string, record: Product) => {
      return (
        <div>
          <Space>
            <Image width={60} height={60} src={record.image} preview={false} />
            <Typography.Text>{record.name}</Typography.Text>
          </Space>
        </div>
      );
    },
  },

  {
    title: "Product Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Status",
    dataIndex: "isPublish",
    key: "isPublish",
    render: (_text: boolean, record: Product) => {
      return (
        <>
          {record.isPublish ? (
            <Tag color="green">Published</Tag>
          ) : (
            <Tag color="purple">Draft</Tag>
          )}
        </>
      );
    },
  },
  {
    title: "CreatedAt",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => {
      return (
        <>
          <Typography.Text>
            {format(new Date(text), "dd/MM/yyyy HH:mm:ss")}
          </Typography.Text>
        </>
      );
    },
  },
];
const Products = () => {
  const [filterForm] = Form.useForm();

  const [queryParams, setQueryParams] = useState({
    perPage: PER_PAGE,
    currentPage: 1,
  });

  const {
    data: products,
    // isFetching,
    // isError,
    // error,
  } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: async () => {
      const filterdParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );
      const queryString = new URLSearchParams(
        filterdParams as unknown as Record<string, string>
      ).toString();
      return await getProducts(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

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

        <Table
          columns={[
            ...columns,
            {
              title: "Actions",
              render: () => {
                return (
                  <Space>
                    <Button type="link">Edit</Button>
                  </Space>
                );
              },
            },
          ]}
          dataSource={products?.data}
          rowKey={"id"}
          pagination={{
            total: products?.total,
            pageSize: queryParams.perPage,
            current: queryParams.currentPage,
            onChange: (page, pageSize) => {
              setQueryParams((prev) => {
                return {
                  ...prev,
                  perPage: pageSize || PER_PAGE,
                  currentPage: page,
                };
              });
            },
            showTotal: (total: number, range: number[]) => {
              return `Showing ${range[0]} - ${range[1]} of ${total} items`;
            },
          }}
        />
      </Space>
    </>
  );
};

export default Products;

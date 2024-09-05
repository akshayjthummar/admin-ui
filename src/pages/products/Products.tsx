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
  Spin,
  Drawer,
  theme,
} from "antd";
import { Link } from "react-router-dom";
import {
  RightOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import ProductFilters from "./ProductFilters";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { PER_PAGE } from "../../constant";
import { createProduct, getProducts } from "../../http/api";
import { FieldData, Product } from "../../types";
import { format } from "date-fns";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";
import ProductForm from "./form/ProductForm";
import { makeFormData } from "./helpers";

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
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const { user } = useAuthStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [queryParams, setQueryParams] = useState({
    limit: PER_PAGE,
    page: 1,
    tenantId: user?.role === "manager" ? user?.tenant : undefined,
  });

  const {
    data: products,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", queryParams],
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

  const debounceQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, page: 1 }));
    }, 500);
  }, []);

  const onFilterChange = (changedFileds: FieldData[]) => {
    const changedFilterFields = changedFileds
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    if ("q" in changedFilterFields) {
      debounceQUpdate(changedFilterFields.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...changedFilterFields,
        page: 1,
      }));
    }
  };

  const queryClient = useQueryClient();
  const { mutate: productMutate } = useMutation({
    mutationKey: ["product"],
    mutationFn: async (data: FormData) =>
      createProduct(data).then((res) => res.data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      form.resetFields();
      setDrawerOpen(false);
      return;
    },
  });

  const onHandleSubmit = async () => {
    await form.validateFields();
    const priceConfiguration = form.getFieldValue("priceConfiguration");
    const pricing = Object.entries(priceConfiguration).reduce(
      (acc, [key, value]) => {
        const parsedKey = JSON.parse(key);
        return {
          ...acc,
          [parsedKey.configurationKey]: {
            priceType: parsedKey.priceType,
            availableOptions: value,
          },
        };
      },
      {}
    );
    const categoryId = JSON.parse(form.getFieldValue("categoryId"))._id;
    const attributes = Object.entries(form.getFieldValue("attributes")).map(
      ([key, value]) => {
        return {
          name: key,
          value: value,
        };
      }
    );
    const postData = {
      ...form.getFieldsValue(),
      isPublish: form.getFieldValue("isPublish") ? true : "",
      categoryId,
      attributes,
      priceConfiguration: pricing,
    };
    const formdata = makeFormData(postData);
    await productMutate(formdata);
  };

  const {
    token: { colorBgLayout },
  } = theme.useToken();

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
          {isFetching && (
            <Spin
              indicator={<LoadingOutlined />}
              style={{ fontSize: 24 }}
              spinning
            />
          )}

          {isError && (
            <Typography.Text type="danger">{error.message}</Typography.Text>
          )}
        </Flex>
        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <ProductFilters>
            <Button
              icon={<PlusOutlined />}
              onClick={() => setDrawerOpen((prev) => !prev)}
              type="primary"
            >
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
          rowKey={"_id"}
          pagination={{
            total: products?.total,
            pageSize: queryParams.limit,
            current: queryParams.page,
            onChange: (page, pageSize) => {
              setQueryParams((prev) => {
                return {
                  ...prev,
                  limit: pageSize || PER_PAGE,
                  page: page,
                };
              });
            },
            showTotal: (total: number, range: number[]) => {
              return `Showing ${range[0]} - ${range[1]} of ${total} items`;
            },
          }}
        />

        <Drawer
          title={"Add Product"}
          width={720}
          destroyOnClose
          open={drawerOpen}
          onClose={() => {
            form.resetFields();
            setDrawerOpen((prev) => !prev);
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setDrawerOpen((prev) => !prev);
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  onHandleSubmit();
                }}
              >
                Submit
              </Button>
            </Space>
          }
          styles={{ body: { background: colorBgLayout } }}
        >
          <Form layout="vertical" form={form}>
            <ProductForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Products;

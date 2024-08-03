import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Space,
  Spin,
  Table,
  theme,
  Typography,
} from "antd";
import {
  RightOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createTenant, getRestaurants } from "../../http/api";
import RestaurantFilter from "./restaurantFilter";
import { useMemo, useState } from "react";
import RestaurantForm from "./form/restaurantForm";
import { Tenant } from "../../types";
import { PER_PAGE } from "../../constant";
import { debounce } from "lodash";

const colums = [
  {
    title: "Id",
    id: "id",
    dataIndex: "id",
  },
  {
    title: "Name",
    id: "name",
    dataIndex: "name",
  },
  {
    title: "Address",
    id: "address",
    dataIndex: "address",
  },
];

const Restuarant = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [queryParams, setQueryParams] = useState({
    perPage: PER_PAGE,
    currentPage: 1,
  });
  const {
    data: restaurants,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["restaurants", queryParams],
    queryFn: async () => {
      const queryString = new URLSearchParams(
        queryParams as unknown as Record<string, string>
      ).toString();
      return await getRestaurants(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });
  const { mutate: tenantMutate } = useMutation({
    mutationKey: ["createTenant"],
    mutationFn: async (data: Tenant) => {
      return await createTenant(data).then((res) => res.data);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });
  const onHandleSubmit = async () => {
    await form.validateFields();
    tenantMutate(form.getFieldsValue());
    form.resetFields();
    setDrawerOpen(false);
  };
  const debouncedQUpdate = useMemo(() => {
    return debounce((values: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: values, currentPage: 1 }));
    }, 500);
  }, []);
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  return (
    <Space style={{ width: "100%" }} direction="vertical">
      <Flex justify="space-between">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to={"/dashboard"}>Dashboard</Link> },
            { title: "Restaurants" },
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
      <RestaurantFilter
        onFilterChange={(_filterName, filterValue) => {
          debouncedQUpdate(filterValue);
        }}
      >
        <Button
          type="primary"
          onClick={() => setDrawerOpen(true)}
          icon={<PlusOutlined />}
        >
          Add Restaurant
        </Button>
      </RestaurantFilter>
      <Table
        columns={colums}
        dataSource={restaurants?.data}
        rowKey={"id"}
        pagination={{
          total: restaurants?.total,
          pageSize: queryParams.perPage,
          current: queryParams.currentPage,
          onChange(page, pageSize) {
            setQueryParams((prev) => {
              return {
                ...prev,
                perPage: pageSize || PER_PAGE,
                currentPage: page,
              };
            });
          },
        }}
      />
      <Drawer
        styles={{ body: { background: colorBgLayout } }}
        width={720}
        open={drawerOpen}
        title="Craete Restaurant"
        destroyOnClose
        onClose={() => {
          form.resetFields();
          setDrawerOpen(false);
        }}
        extra={
          <Space>
            <Button
              onClick={() => {
                form.resetFields();
                setDrawerOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="primary" onClick={() => onHandleSubmit()}>
              Submit
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <RestaurantForm></RestaurantForm>
        </Form>
      </Drawer>
    </Space>
  );
};

export default Restuarant;

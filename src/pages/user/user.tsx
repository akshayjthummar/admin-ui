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
import { RightOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createUser, getUsers, updateUser } from "../../http/api";
import { CreateUserData, FieldData, User } from "../../types";
import { useAuthStore } from "../../store";
import UserFilters from "./UserFilters";
import { useEffect, useMemo, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import UserForm from "./form/UserForm";
import { PER_PAGE } from "../../constant";
import { debounce } from "lodash";

const columns = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "firstName",
    key: "firstName",
    render: (_text: string, record: User) => {
      return (
        <div>
          {record.firstName} {record.lastName}
        </div>
      );
    },
  },

  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "Restaurant",
    dataIndex: "tenant",
    key: "tenant",
    render: (_text: string, record: User) => {
      return <div>{record?.tenant?.name}</div>;
    },
  },
];

const UserPagae = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const queryClient = useQueryClient();
  const [queryParams, setQueryParams] = useState({
    perPage: PER_PAGE,
    currentPage: 1,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentEditingUser, setCurrentEditingUser] = useState<User | null>(
    null
  );

  useEffect(() => {
    if (currentEditingUser) {
      setDrawerOpen(true);
      form.setFieldsValue({
        ...currentEditingUser,
        tenantId: currentEditingUser.tenant?.id,
      });
    }
  }, [currentEditingUser, form]);
  const {
    data: users,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: async () => {
      const filterdParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );
      const queryString = new URLSearchParams(
        filterdParams as unknown as Record<string, string>
      ).toString();
      return await getUsers(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  const { mutate: userMutate } = useMutation({
    mutationKey: ["user"],
    mutationFn: async (data: CreateUserData) =>
      createUser(data).then((res) => res.data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return;
    },
  });

  const { mutate: UpdateUserMutation } = useMutation({
    mutationKey: ["update-user"],
    mutationFn: async (data: CreateUserData) => {
      updateUser(data, currentEditingUser!.id).then((res) => res.data);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return;
    },
  });

  const onHandleSubmit = async () => {
    await form.validateFields();
    const isEditMode = !!currentEditingUser;
    if (isEditMode) {
      await UpdateUserMutation(form.getFieldsValue());
    } else {
      await userMutate(form.getFieldsValue());
    }
    form.resetFields();
    setCurrentEditingUser(null);
    setDrawerOpen(false);
  };
  const debouncedQUpdate = useMemo(() => {
    return debounce((values: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: values, currentPage: 1 }));
    }, 500);
  }, []);
  const onFilterChange = (changedFileds: FieldData[]) => {
    const changedFilterFields = changedFileds
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    if ("q" in changedFilterFields) {
      debouncedQUpdate(changedFilterFields.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...changedFilterFields,
        currentPage: 1,
      }));
    }
  };

  const { user } = useAuthStore();
  if (user?.role !== "admin") {
    return <Navigate to={"/"} replace={true} />;
  }

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
              { title: "Users" },
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
          <UserFilters>
            <Button
              icon={<PlusOutlined />}
              onClick={() => setDrawerOpen(true)}
              type="primary"
            >
              Add User
            </Button>
          </UserFilters>
        </Form>
        <Table
          columns={[
            ...columns,
            {
              title: "Actions",
              render: (_: string, record: User) => {
                return (
                  <Space>
                    <Button
                      onClick={() => {
                        setCurrentEditingUser(record);
                      }}
                      type="link"
                    >
                      Edit
                    </Button>
                  </Space>
                );
              },
            },
          ]}
          dataSource={users?.data}
          rowKey={"id"}
          pagination={{
            total: users?.total,
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

        <Drawer
          title={currentEditingUser === null ? "Add User" : "Update User"}
          width={720}
          destroyOnClose
          open={drawerOpen}
          onClose={() => {
            form.resetFields();
            setDrawerOpen(false);
            setCurrentEditingUser(null);
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setDrawerOpen(false);
                  setCurrentEditingUser(null);
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
                {currentEditingUser === null ? "Submit" : "Update"}
              </Button>
            </Space>
          }
          styles={{ body: { background: colorBgLayout } }}
        >
          <Form layout="vertical" form={form}>
            <UserForm isEditMode={!!currentEditingUser} />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default UserPagae;

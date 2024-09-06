import { Card, Col, Form, Radio, Row, Switch, Typography } from "antd";
import { Category } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../../http/api";

type AttributeProps = {
  selectedCategory: string;
};
const Attributes = ({ selectedCategory }: AttributeProps) => {
  const { data: fetchingCategory } = useQuery<Category>({
    queryKey: ["category", selectedCategory],
    queryFn: async () => {
      return await getCategory(selectedCategory).then((res) => res.data);
    },
    staleTime: 1000 * 60 * 5,
  });
  if (!fetchingCategory) {
    return null;
  }
  return (
    <Card
      title={<Typography.Text>Product Attributes</Typography.Text>}
      bordered={false}
    >
      {fetchingCategory.attributes.map((attribute) => {
        return (
          <div key={attribute.name}>
            {attribute.widgetType === "radio" ? (
              <Form.Item
                label={attribute.name}
                name={["attributes", attribute.name]}
                initialValue={attribute.defaultValue}
                rules={[
                  { required: true, message: `${attribute.name} is required` },
                ]}
              >
                <Radio.Group>
                  {attribute.availableOptions.map((option) => {
                    return (
                      <Radio.Button value={option} key={option}>
                        {option}
                      </Radio.Button>
                    );
                  })}
                </Radio.Group>
              </Form.Item>
            ) : attribute.widgetType === "switch" ? (
              <Row>
                <Col>
                  <Form.Item
                    label={attribute.name}
                    name={["attributes", attribute.name]}
                    valuePropName="checked"
                    initialValue={attribute.defaultValue}
                  >
                    <Switch
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                    ></Switch>
                  </Form.Item>
                </Col>
              </Row>
            ) : null}
          </div>
        );
      })}
    </Card>
  );
};
export default Attributes;

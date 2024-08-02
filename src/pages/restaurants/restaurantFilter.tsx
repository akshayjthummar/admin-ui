import { Card, Col, Input, Row } from "antd";
type RestaurantFilterProps = {
  onFilterChange: (filterName: string, filterValue: string) => void;
  children: React.ReactNode;
};
const RestaurantFilter = ({
  onFilterChange,
  children,
}: RestaurantFilterProps) => {
  return (
    <Card>
      <Row style={{ display: "flex", justifyContent: "space-between" }}>
        <Col>
          <Input.Search
            placeholder="Search"
            onChange={(e) => onFilterChange("searchFilter", e.target.value)}
          />
        </Col>
        <Col>{children}</Col>
      </Row>
    </Card>
  );
};

export default RestaurantFilter;

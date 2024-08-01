import { Outlet } from "react-router-dom";

const NonAuth = () => {
  return (
    <div>
      <h1>NonAuth Components</h1>
      <Outlet />
    </div>
  );
};

export default NonAuth;

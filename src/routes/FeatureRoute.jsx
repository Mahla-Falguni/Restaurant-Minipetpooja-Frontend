import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import UpgradeRequired from "../components/common/UpgradeRequired";

/*
=========================================================
FEATURE ROUTE
Nest this inside a <ProtectedRoute> (role check already passed)
to also require a plan feature before rendering the route's
children. While the plan features are still loading for the
first time, renders nothing rather than flashing the upgrade
screen.

Usage:
<Route element={<ProtectedRoute allowedRoles={["Admin","Manager"]} />}>
  <Route element={<FeatureRoute feature="Staff & Payroll" />}>
    <Route path="/staff" element={<Staff />} />
  </Route>
</Route>
=========================================================
*/

const FeatureRoute = ({ feature }) => {

  const { myFeatures, featuresLoaded } = useSelector((state) => state.subscription);

  if (!featuresLoaded) {
    return null;
  }

  if (!myFeatures.includes(feature)) {
    return <UpgradeRequired feature={feature} />;
  }

  return <Outlet />;

};

export default FeatureRoute;
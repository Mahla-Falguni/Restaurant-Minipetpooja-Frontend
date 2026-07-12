import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

const DashboardLayout = ({ children, title = "Dashboard", subtitle }) => {

  return (
    <div className="flex h-screen overflow-hidden bg-paper">

      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">

        <Topbar title={title} subtitle={subtitle} />

        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>

      </div>

    </div>
  );

};

export default DashboardLayout;
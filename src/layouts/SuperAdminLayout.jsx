import SuperAdminSidebar from "../components/superAdmin/SuperAdminSidebar";
import SuperAdminTopbar from "../components/superAdmin/SuperAdminTopbar";

const SuperAdminLayout = ({ children, title = "Platform Admin", subtitle }) => {

  return (
    <div className="flex min-h-screen bg-paper">

      <SuperAdminSidebar />

      <div className="flex-1 min-w-0">

        <SuperAdminTopbar title={title} subtitle={subtitle} />

        <div className="p-8">
          {children}
        </div>

      </div>

    </div>
  );

};

export default SuperAdminLayout;
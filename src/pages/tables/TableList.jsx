import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LuPlus, LuQrCode, LuTrash2, LuTable2 } from "react-icons/lu";

import DashboardLayout from "../../layouts/DashboardLayouts";
import Button from "../../components/common/Button";
import Badge from "../../components/kitchen/Badge";
import { getTables, deleteTable } from "../../redux/table/tableSlice";

const statusTone = {
  Available: "basil",
  Occupied: "ember",
  Reserved: "saffron",
  Cleaning: "slate",
  "Out of Service": "claret",
};

const TableList = () => {
  const dispatch = useDispatch();
  const { tables, loading, error } = useSelector((state) => state.tables);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(getTables());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this table? This cannot be undone.")) return;
    setDeletingId(id);
    await dispatch(deleteTable(id));
    setDeletingId(null);
  };

  return (
    <DashboardLayout title="Tables" subtitle="Manage your dining floor">

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-charcoal/60">
          {tables?.length || 0} table{tables?.length === 1 ? "" : "s"}
        </p>
        <Link to="/tables/create">
          <Button icon={LuPlus}>Add Table</Button>
        </Link>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-claret/30 bg-claret/5 px-4 py-3 text-sm text-claret">
          {error}
        </div>
      )}

      {loading && !tables?.length ? (
        <p className="text-charcoal/50">Loading tables…</p>
      ) : !tables?.length ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-ember/10 text-ember flex items-center justify-center mx-auto mb-5">
            <LuTable2 size={24} />
          </div>
          <h2 className="font-display text-xl text-ink mb-2">No tables yet</h2>
          <p className="text-charcoal/50 mb-5">Add your first table to start taking orders.</p>
          <Link to="/tables/create">
            <Button icon={LuPlus}>Add Table</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <div key={table._id} className="rounded-2xl border border-line bg-white p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-display text-lg text-ink">Table {table.table_number}</p>
                  <p className="text-xs text-charcoal/50">{table.zone} · Seats {table.seating_capacity}</p>
                </div>
                <Badge tone={statusTone[table.status] || "slate"}>{table.status}</Badge>
              </div>

              <div className="flex gap-2 mt-4">
                <Link to={`/qr/${table._id}`} className="flex-1">
                  <Button variant="outline" size="sm" icon={LuQrCode} fullWidth>QR</Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  icon={LuTrash2}
                  loading={deletingId === table._id}
                  onClick={() => handleDelete(table._id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

    </DashboardLayout>
  );
};

export default TableList;
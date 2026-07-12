import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LuQrCode, LuRefreshCw, LuEye } from "react-icons/lu";

import DashboardLayout from "../../layouts/DashboardLayouts";
import Button from "../../components/common/Button";
import Badge from "../../components/kitchen/Badge";
import axiosInstance from "../../api/axiosInstance";
import { getTables } from "../../redux/table/tableSlice";

const QRManagement = () => {
  const dispatch = useDispatch();
  const { tables, loading } = useSelector((state) => state.tables);

  const [generatingId, setGeneratingId] = useState(null);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(getTables());
  }, [dispatch]);

  const handleGenerateOne = async (tableId) => {
    setGeneratingId(tableId);
    setError(null);
    try {
      await axiosInstance.post(`/qr/table/${tableId}`);
      dispatch(getTables());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate QR.");
    } finally {
      setGeneratingId(null);
    }
  };

  const handleGenerateAll = async () => {
    setGeneratingAll(true);
    setError(null);
    try {
      await axiosInstance.post("/qr/generate-all");
      dispatch(getTables());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate QR codes.");
    } finally {
      setGeneratingAll(false);
    }
  };

  return (
    <DashboardLayout title="QR Management" subtitle="Generate and manage table QR codes for the customer menu">

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-charcoal/60">
          {tables?.length || 0} table{tables?.length === 1 ? "" : "s"}
        </p>

        <Button
          icon={LuRefreshCw}
          loading={generatingAll}
          onClick={handleGenerateAll}
          disabled={!tables?.length}
        >
          Generate All
        </Button>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-claret/30 bg-claret/5 px-4 py-3 text-sm text-claret">
          {error}
        </div>
      )}

      {loading && !tables?.length ? (
        <p className="text-charcoal/50">Loading tables…</p>
      ) : !tables?.length ? (
        <div className="rounded-2xl border border-dashed border-line p-10 text-center text-charcoal/50">
          No tables yet.{" "}
          <Link to="/tables" className="text-ember font-semibold">
            Add a table first
          </Link>
          {" "}before generating QR codes.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table) => (
            <div
              key={table._id}
              className="rounded-2xl border border-line bg-white p-5 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-lg text-ink">
                    Table {table.table_number}
                  </p>
                  <p className="text-xs text-charcoal/50">{table.zone}</p>
                </div>
                <Badge tone={table.qr_url ? "basil" : "slate"}>
                  {table.qr_url ? "QR Ready" : "No QR"}
                </Badge>
              </div>

              <div className="flex items-center justify-center rounded-xl bg-paper-dim h-32">
                {table.qr_url ? (
                  <img src={table.qr_url} alt={`QR for table ${table.table_number}`} className="h-28 w-28 object-contain" />
                ) : (
                  <LuQrCode size={40} className="text-charcoal/20" />
                )}
              </div>

              <div className="flex gap-2">
                

                {table.qr_url && (
                  <Link to={`/qr/${table._id}`} className="flex-1">
                    <Button variant="dark" size="sm" icon={LuEye} fullWidth>
                      Preview
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </DashboardLayout>
  );
};

export default QRManagement;
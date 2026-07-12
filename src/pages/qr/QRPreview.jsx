import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { LuArrowLeft, LuPrinter } from "react-icons/lu";

import DashboardLayout from "../../layouts/DashboardLayouts";
import Button from "../../components/common/Button";
import axiosInstance from "../../api/axiosInstance";

const QRPreview = () => {
  const { tableId } = useParams();

  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchQR = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/qr/table/${tableId}`);
        if (!cancelled) setTable(res.data.data);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Failed to load QR code.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchQR();
    return () => { cancelled = true; };
  }, [tableId]);

  return (
    <DashboardLayout title="Table QR Preview" subtitle="Print-ready QR code for the customer ordering menu">

      <Link to="/qr" className="inline-flex items-center gap-1.5 text-sm text-charcoal/60 hover:text-ink mb-6">
        <LuArrowLeft size={16} />
        Back to QR Management
      </Link>

      {loading && <p className="text-charcoal/50">Loading…</p>}

      {error && (
        <div className="rounded-lg border border-claret/30 bg-claret/5 px-4 py-3 text-sm text-claret max-w-md">
          {error}
        </div>
      )}

      {!loading && !error && table && (
        <div className="bg-white rounded-2xl border border-line p-10 max-w-md text-center">

          <h2 className="font-display text-2xl font-semibold text-ink mb-1">
            Table {table.table_number}
          </h2>
          <p className="text-sm text-charcoal/50 mb-6">
            Scan to view the menu and order
          </p>

          <div className="flex items-center justify-center mb-6">
            <img src={table.qr_url} alt={`QR code for table ${table.table_number}`} className="w-64 h-64 object-contain" />
          </div>

          <Button icon={LuPrinter} onClick={() => window.print()} fullWidth>
            Print QR Code
          </Button>

        </div>
      )}

    </DashboardLayout>
  );
};

export default QRPreview;
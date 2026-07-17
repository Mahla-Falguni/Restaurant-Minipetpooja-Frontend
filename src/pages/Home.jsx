import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LuCalendarDays,
  LuQrCode,
  LuLayoutGrid,
  LuUsers,
  LuChefHat,
  LuUserCheck,
  LuArrowRight,
  LuCircleCheck,
  LuPhone,
  LuUser,
  LuStore,
} from "react-icons/lu";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import Button from "../components/common/Button";
import { Input, Select } from "../components/Input";

const Home = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [tables, setTables] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [loadingTables, setLoadingTables] = useState(false);
  const [simulatedCode, setSimulatedCode] = useState("");

  // Reservation form state
  const [resForm, setResForm] = useState({
    customer_name: "",
    customer_phone: "",
    party_size: "2",
    reservation_date: "",
    reservation_time: "",
    zone_preference: "Main",
    special_requests: "",
  });
  const [resLoading, setResLoading] = useState(false);
  const [resSuccessModal, setResSuccessModal] = useState(false);
  const [createdRes, setCreatedRes] = useState(null);

  // Fetch all active restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axiosInstance.get("/public/restaurants");
        if (response.data.success) {
          const list = response.data.data;
          setRestaurants(list);
          if (list.length > 0) {
            setSelectedRestaurant(list[0]._id);
          }
        }
      } catch (err) {
        console.error("Failed to load restaurants", err);
        toast.error("Failed to load restaurants list.");
      } finally {
        setLoadingRestaurants(false);
      }
    };
    fetchRestaurants();
  }, []);

  // Fetch tables when selected restaurant changes
  useEffect(() => {
    if (!selectedRestaurant) {
      setTables([]);
      return;
    }
    const fetchTables = async () => {
      setLoadingTables(true);
      try {
        const response = await axiosInstance.get(`/public/restaurants/${selectedRestaurant}/tables`);
        if (response.data.success) {
          setTables(response.data.data);
        }
      } catch (err) {
        console.error("Failed to load tables", err);
      } finally {
        setLoadingTables(false);
      }
    };
    fetchTables();
  }, [selectedRestaurant]);

  // Handle reservation submission
  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRestaurant) {
      toast.error("Please select a restaurant.");
      return;
    }
    if (!resForm.customer_name.trim() || !resForm.customer_phone.trim() || !resForm.reservation_date || !resForm.reservation_time) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setResLoading(true);
    try {
      const response = await axiosInstance.post("/public/reservations", {
        restaurant_id: selectedRestaurant,
        ...resForm,
        party_size: Number(resForm.party_size),
      });

      if (response.data.success) {
        setCreatedRes(response.data.data);
        setResSuccessModal(true);
        setResForm({
          customer_name: "",
          customer_phone: "",
          party_size: "2",
          reservation_date: "",
          reservation_time: "",
          zone_preference: "Main",
          special_requests: "",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to make reservation.");
    } finally {
      setResLoading(false);
    }
  };

  // QR code scan simulation
  const handleQRSubmit = (e) => {
    e.preventDefault();
    if (!simulatedCode.trim()) {
      toast.error("Please select or enter a table code.");
      return;
    }
    navigate(`/menu/${simulatedCode.trim()}`);
  };

  // Pre-fill simulated table code
  const fillSimulateCode = (code) => {
    setSimulatedCode(code);
    toast.success(`Table code ${code} set! Scroll to simulator and click enter.`);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Available":
        return "bg-basil-light text-basil border border-basil/20";
      case "Occupied":
        return "bg-claret-light text-claret border border-claret/20";
      case "Reserved":
        return "bg-saffron-light text-saffron border border-saffron/20";
      case "Cleaning":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-paper/85 backdrop-blur-md border-b border-line px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-ember flex items-center justify-center text-white font-display text-lg font-bold shadow-md shadow-ember/20">
            P
          </div>
          <div>
            <span className="font-display text-lg font-bold text-ink tracking-tight">MiniPetpooja</span>
            <span className="text-[10px] ml-1.5 px-1.5 py-0.5 rounded-full bg-ember-light text-ember font-medium font-mono uppercase tracking-wider">
              POS
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate">
          <a href="#simulator" className="hover:text-ink transition-colors">Dine-In QR Simulator</a>
          <a href="#occupancy" className="hover:text-ink transition-colors">Live Table Occupancy</a>
          <a href="#reserve" className="hover:text-ink transition-colors">Book a Table</a>
          <a href="#partner" className="hover:text-ink transition-colors">POS Modules</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-slate hover:text-ink px-3 py-1.5 transition-colors">
            Login
          </Link>
          <Link to="/register">
            <Button size="sm">Register</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-ember-light/20 via-paper to-paper pt-16 pb-12 px-4 sm:px-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ember/10 border border-ember/15">
            <span className="w-1.5 h-1.5 rounded-full bg-ember animate-ping"></span>
            <span className="text-xs font-semibold text-ember uppercase tracking-wider font-mono">
              Direct Dine-In Ordering Live
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-ink leading-[1.08] tracking-tight">
            Smarter Restaurant Operations, <span className="text-ember">In One Place.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate max-w-xl leading-relaxed">
            The next-generation POS system combining manager control panel, staff shift logs, cashier drawers, kitchen status monitors, and direct customer table QR code ordering.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a href="#reserve">
              <Button className="flex items-center gap-2 group shadow-lg shadow-ember/15">
                Book a Table <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <a href="#simulator">
              <button className="h-11 px-5 rounded-lg border border-line bg-white font-medium text-charcoal hover:bg-paper-dim hover:text-ink transition-all flex items-center gap-2 text-sm">
                <LuQrCode size={16} /> Simulate Dine-In Order
              </button>
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 relative flex justify-center">
          {/* Glassmorphic Platform Preview Box */}
          <div className="w-full max-w-md rounded-2xl bg-white border border-line shadow-xl p-6 relative overflow-hidden ticket-edge">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-ink">Scan & Order Demo</h3>
                <p className="text-xs text-slate">Try it out in real time</p>
              </div>
              <LuQrCode size={28} className="text-ember" />
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-paper-dim/60 rounded-lg border border-line/40 text-sm">
                <p className="font-semibold text-charcoal mb-1">Step 1: Choose a test restaurant</p>
                <div className="flex gap-2">
                  <select
                    className="w-full text-xs h-8 border border-line bg-white rounded px-2"
                    value={selectedRestaurant}
                    onChange={(e) => setSelectedRestaurant(e.target.value)}
                  >
                    {loadingRestaurants ? (
                      <option>Loading restaurants...</option>
                    ) : restaurants.length === 0 ? (
                      <option>No restaurants found</option>
                    ) : (
                      restaurants.map((r) => (
                        <option key={r._id} value={r._id}>
                          {r.restaurant_name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-paper-dim/60 rounded-lg border border-line/40 text-sm">
                <p className="font-semibold text-charcoal mb-1">Step 2: Choose a table code to simulate scan</p>
                {loadingTables ? (
                  <p className="text-xs text-slate">Loading tables...</p>
                ) : tables.length === 0 ? (
                  <p className="text-xs text-slate text-claret">No tables set up for this restaurant. Please login as Admin to add tables first.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                    {tables.map((t) => (
                      <button
                        key={t._id}
                        onClick={() => fillSimulateCode(t.table_code || t._id)}
                        className={`text-xs px-2.5 py-1.5 rounded font-mono font-semibold transition-all border ${
                          simulatedCode === (t.table_code || t._id)
                            ? "bg-ember border-ember text-white shadow-sm shadow-ember/20"
                            : "bg-white border-line text-slate hover:border-slate/50"
                        }`}
                      >
                        {t.table_number} ({t.status})
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Link to={simulatedCode ? `/menu/${simulatedCode}` : "#"}>
                  <Button fullWidth disabled={!simulatedCode} className="flex items-center justify-center gap-2">
                    <LuQrCode size={16} /> Open Table Menu & Order
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulator / QR Scan Simulation */}
      <section id="simulator" className="border-t border-line py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-10">
          <span className="eyebrow text-ember">Interactive Tool</span>
          <h2 className="text-3xl font-display font-bold text-ink">Simulate a Table QR Scan</h2>
          <p className="text-sm text-slate">
            In our restaurant POS system, each table has a dedicated QR code. Scan or type the table code below to open the customer menu.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white p-6 rounded-xl border border-line shadow-sm">
          <form onSubmit={handleQRSubmit} className="space-y-4">
            <div className="relative">
              <Input
                label="Enter Table Code"
                placeholder="e.g. T-01, Rooftop-2"
                value={simulatedCode}
                onChange={(e) => setSimulatedCode(e.target.value)}
                className="pl-10"
              />
              <LuQrCode size={16} className="absolute left-3 top-[38px] text-slate/50 pointer-events-none" />
            </div>

            <Button type="submit" fullWidth className="h-10">
              Open Direct Ordering Menu
            </Button>
          </form>
          <div className="mt-4 text-center">
            <span className="text-xs text-slate">
              Alternatively, select a restaurant above to click on a table code automatically.
            </span>
          </div>
        </div>
      </section>

      {/* Live Table Occupancy Section */}
      <section id="occupancy" className="bg-paper-dim/40 border-t border-line py-16 px-4 sm:px-8 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="space-y-2 text-left">
              <span className="eyebrow text-basil">Customer Lounge</span>
              <h2 className="text-3xl font-display font-bold text-ink">Live Table Occupancy</h2>
              <p className="text-sm text-slate">
                See real-time table statuses, capacity, and seating locations before booking.
              </p>
            </div>

            <div className="w-full md:w-72">
              <Select
                label="Select Restaurant"
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
              >
                {restaurants.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.restaurant_name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {loadingTables ? (
            <div className="text-center py-10">
              <div className="w-10 h-10 border-4 border-t-ember border-ember/20 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-slate">Updating table layout...</p>
            </div>
          ) : tables.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-line">
              <p className="text-sm text-slate">No tables set up for this restaurant yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {tables.map((t) => (
                <div
                  key={t._id}
                  className="bg-white rounded-xl border border-line p-4 flex flex-col justify-between min-h-[120px] transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-display font-bold text-base text-ink">Table {t.table_number}</h4>
                      <p className="text-[11px] text-slate font-medium">{t.zone} Zone</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusBadgeClass(t.status)}`}>
                      {t.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate border-t border-line/60 pt-2.5 mt-4">
                    <span className="flex items-center gap-1 font-medium text-[11px]">
                      <LuUsers size={12} /> Capacity: {t.seating_capacity}
                    </span>
                    {t.status === "Available" && (
                      <button
                        onClick={() => fillSimulateCode(t.table_code || t._id)}
                        className="text-[11px] text-ember hover:underline font-semibold"
                      >
                        Order Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Table Reservation Section */}
      <section id="reserve" className="border-t border-line py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="eyebrow text-ember">Online Booking</span>
            <h2 className="text-3xl font-display font-bold text-ink">Book Your Table Instantly</h2>
            <p className="text-sm text-slate leading-relaxed">
              Reserve your spot and zone preference online. Once requested, the restaurant manager will review and confirm your table slot, ensuring it is prepared for your arrival.
            </p>
            <div className="p-4 bg-paper-dim rounded-xl border border-line space-y-3">
              <h4 className="font-display font-bold text-charcoal">Why Book Online?</h4>
              <ul className="text-xs text-slate space-y-2 list-disc list-inside">
                <li>Choose your preferred zone (Outdoor, Rooftop, VIP etc.)</li>
                <li>Leave special requests (anniversaries, dietary notes)</li>
                <li>Real-time confirmation alerts</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-line shadow-sm">
            <form onSubmit={handleReservationSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Select
                    label="Select Restaurant"
                    value={selectedRestaurant}
                    onChange={(e) => setSelectedRestaurant(e.target.value)}
                  >
                    {restaurants.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.restaurant_name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="relative">
                  <Input
                    label="Full Name *"
                    placeholder="Your Name"
                    value={resForm.customer_name}
                    onChange={(e) => setResForm({ ...resForm, customer_name: e.target.value })}
                    className="pl-10"
                    required
                  />
                  <LuUser size={16} className="absolute left-3 top-[38px] text-slate/50 pointer-events-none" />
                </div>

                <div className="relative">
                  <Input
                    label="Phone Number *"
                    placeholder="Mobile number"
                    type="tel"
                    value={resForm.customer_phone}
                    onChange={(e) => setResForm({ ...resForm, customer_phone: e.target.value })}
                    className="pl-10"
                    required
                  />
                  <LuPhone size={16} className="absolute left-3 top-[38px] text-slate/50 pointer-events-none" />
                </div>

                <Input
                  label="Party Size (Guests) *"
                  type="number"
                  min="1"
                  max="30"
                  value={resForm.party_size}
                  onChange={(e) => setResForm({ ...resForm, party_size: e.target.value })}
                  required
                />

                <Select
                  label="Zone Preference"
                  value={resForm.zone_preference}
                  onChange={(e) => setResForm({ ...resForm, zone_preference: e.target.value })}
                >
                  <option value="Main">Main Floor</option>
                  <option value="Rooftop">Rooftop</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Private">Private Lounge</option>
                </Select>

                <Input
                  label="Date *"
                  type="date"
                  value={resForm.reservation_date}
                  onChange={(e) => setResForm({ ...resForm, reservation_date: e.target.value })}
                  required
                />

                <Input
                  label="Time *"
                  type="time"
                  value={resForm.reservation_time}
                  onChange={(e) => setResForm({ ...resForm, reservation_time: e.target.value })}
                  required
                />

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-charcoal mb-1.5">Special Instructions</label>
                  <textarea
                    placeholder="Any special notes or requests..."
                    value={resForm.special_requests}
                    onChange={(e) => setResForm({ ...resForm, special_requests: e.target.value })}
                    className="w-full rounded-lg border border-line px-3 py-2 text-sm bg-white text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-ember/30 focus:border-ember"
                    rows={3}
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" fullWidth loading={resLoading}>
                  Submit Reservation Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* POS Modules / Partner Section */}
      <section id="partner" className="border-t border-line bg-ink text-white py-16 px-4 sm:px-8 w-full">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="max-w-xl mx-auto space-y-3">
            <span className="eyebrow text-ember font-semibold">POS Dashboard</span>
            <h2 className="text-3xl font-display font-bold text-white">Full-Suite Management Modules</h2>
            <p className="text-sm text-slate-400">
              One platform, multiple specialized views depending on staff roles. Select a role below to access their console.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 text-left">
            {/* Admin card */}
            <div className="bg-ink-soft border border-white/10 rounded-xl p-5 flex flex-col justify-between group hover:border-ember transition-colors">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-ember/15 border border-ember/25 text-ember flex items-center justify-center font-bold">
                  <LuStore size={20} />
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold">Admin</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Set up restaurants, manage tables, menus, view subscription plans, billing.
                  </p>
                </div>
              </div>
              <Link to="/login?role=Admin" className="mt-6 inline-flex items-center gap-1.5 text-xs text-ember font-semibold hover:underline">
                Login as Admin <LuArrowRight size={14} />
              </Link>
            </div>

            {/* Manager card */}
            <div className="bg-ink-soft border border-white/10 rounded-xl p-5 flex flex-col justify-between group hover:border-ember transition-colors">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-ember/15 border border-ember/25 text-ember flex items-center justify-center font-bold">
                  <LuUserCheck size={20} />
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold">Manager</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Oversee menu edits, review shifts, verify employee attendance, handle payroll.
                  </p>
                </div>
              </div>
              <Link to="/login?role=Manager" className="mt-6 inline-flex items-center gap-1.5 text-xs text-ember font-semibold hover:underline">
                Login as Manager <LuArrowRight size={14} />
              </Link>
            </div>

            {/* Waiter card */}
            <div className="bg-ink-soft border border-white/10 rounded-xl p-5 flex flex-col justify-between group hover:border-ember transition-colors">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-ember/15 border border-ember/25 text-ember flex items-center justify-center font-bold">
                  <LuUsers size={20} />
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold">Waiter</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    View active tables, seat guests, record table-side orders, trigger status updates.
                  </p>
                </div>
              </div>
              <Link to="/login?role=Waiter" className="mt-6 inline-flex items-center gap-1.5 text-xs text-ember font-semibold hover:underline">
                Login as Waiter <LuArrowRight size={14} />
              </Link>
            </div>

            {/* Cashier card */}
            <div className="bg-ink-soft border border-white/10 rounded-xl p-5 flex flex-col justify-between group hover:border-ember transition-colors">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-ember/15 border border-ember/25 text-ember flex items-center justify-center font-bold">
                  <LuLayoutGrid size={20} />
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold">Cashier</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Manage cash drawer, verify checkout cues, process offline invoices, issue refunds.
                  </p>
                </div>
              </div>
              <Link to="/login?role=Cashier" className="mt-6 inline-flex items-center gap-1.5 text-xs text-ember font-semibold hover:underline">
                Login as Cashier <LuArrowRight size={14} />
              </Link>
            </div>

            {/* Kitchen card */}
            <div className="bg-ink-soft border border-white/10 rounded-xl p-5 flex flex-col justify-between group hover:border-ember transition-colors">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-ember/15 border border-ember/25 text-ember flex items-center justify-center font-bold">
                  <LuChefHat size={20} />
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold">Kitchen</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Access Kitchen Display System (KDS), manage active cooking queues, update readiness.
                  </p>
                </div>
              </div>
              <Link to="/login?role=Kitchen" className="mt-6 inline-flex items-center gap-1.5 text-xs text-ember font-semibold hover:underline">
                Login as Kitchen <LuArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line py-8 text-center text-xs text-slate bg-paper px-4">
        <p>© 2026 MiniPetpooja Restaurant POS system. All rights reserved.</p>
      </footer>

      {/* Reservation Success Modal */}
      {resSuccessModal && createdRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl border border-line shadow-2xl p-6 max-w-sm w-full text-center relative overflow-hidden ticket-edge">
            <LuCircleCheck size={48} className="text-basil mx-auto mb-3" />
            <h3 className="font-display text-xl font-bold text-ink">Reservation Requested</h3>
            <p className="text-xs text-slate mt-1.5">
              Your request has been submitted to the restaurant. We will reach out to confirm your booking.
            </p>

            <div className="bg-paper-dim/60 rounded-lg p-3 border border-line/50 text-left my-4 text-xs font-mono space-y-1.5">
              <div><span className="text-slate font-sans">Guest Name:</span> {createdRes.customer_name}</div>
              <div><span className="text-slate font-sans">Party Size:</span> {createdRes.party_size} Guests</div>
              <div><span className="text-slate font-sans">Date:</span> {createdRes.reservation_date}</div>
              <div><span className="text-slate font-sans">Time:</span> {createdRes.reservation_time}</div>
              <div><span className="text-slate font-sans">Zone:</span> {createdRes.zone_preference} Zone</div>
              <div><span className="text-slate font-sans">Status:</span> <span className="font-semibold text-basil">{createdRes.status}</span></div>
            </div>

            <Button size="sm" fullWidth onClick={() => setResSuccessModal(false)}>
              Got it, thanks!
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

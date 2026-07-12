import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { LuPlus, LuMinus, LuTrash2, LuArrowLeft } from "react-icons/lu";
import DashboardLayout from "../../layouts/DashboardLayouts";
import TicketCard from "../../components/TicketCard";
import Badge from "../../components/kitchen/Badge";
import Button from "../../components/common/Button";
import { Input } from "../../components/Input";
import EmptyState from "../../components/EmptyState";
import {
    fetchWaiterTables,
    fetchWaiterOrders,
    createWaiterOrder
} from "../../redux/waiter/waiterSlice";
import fetchMenuItems from "../../redux/menu/menuSlice";

const itemStatusTone = {
    Pending: "warning",
    Preparing: "ember",
    Ready: "success",
    Served: "muted"
};

const WaiterTableDetail = () => {
    const { tableId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { tables, orders, actionLoading } = useSelector((state) => state.waiter);
    const { items: menuItems, loading: menuLoading } = useSelector((state) => state.menu);

    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [cart, setCart] = useState([]);

    useEffect(() => {
        dispatch(fetchWaiterTables());
        dispatch(fetchWaiterOrders({ status: "Active" }));
        dispatch(fetchMenuItems());
    }, [dispatch]);

    const table = tables.find((t) => t._id === tableId);
    const existingOrder = orders.find(
        (o) => (o.table_id?._id || o.table_id) === tableId
    );

    const categories = useMemo(() => {
        const set = new Set(menuItems.map((m) => m.category).filter(Boolean));
        return ["All", ...set];
    }, [menuItems]);

    const filteredMenu = useMemo(() => {
        return menuItems.filter((m) => {
            const matchesCategory = activeCategory === "All" || m.category === activeCategory;
            const matchesSearch = m.name?.toLowerCase().includes(search.toLowerCase());
            return matchesCategory && matchesSearch && m.is_available !== false;
        });
    }, [menuItems, activeCategory, search]);

    const addToCart = (menuItem) => {
        setCart((prev) => {
            const existing = prev.find((c) => c.menu_item_id === menuItem._id);
            if (existing) {
                return prev.map((c) =>
                    c.menu_item_id === menuItem._id ? { ...c, quantity: c.quantity + 1 } : c
                );
            }
            return [
                ...prev,
                {
                    menu_item_id: menuItem._id,
                    item_name: menuItem.name,
                    price: menuItem.price,
                    quantity: 1
                }
            ];
        });
    };

    const changeQty = (menuItemId, delta) => {
        setCart((prev) =>
            prev
                .map((c) =>
                    c.menu_item_id === menuItemId
                        ? { ...c, quantity: c.quantity + delta }
                        : c
                )
                .filter((c) => c.quantity > 0)
        );
    };

    const removeFromCart = (menuItemId) => {
        setCart((prev) => prev.filter((c) => c.menu_item_id !== menuItemId));
    };

    const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

    const handleSendToKitchen = async () => {
        if (cart.length === 0) return;

        const payload = {
            table_id: tableId,
            order_type: "Dine-in",
            items: cart.map((c) => ({
                menu_item_id: c.menu_item_id,
                quantity: c.quantity
            }))
        };

        const result = await dispatch(createWaiterOrder(payload));
        if (createWaiterOrder.fulfilled.match(result)) {
            setCart([]);
            dispatch(fetchWaiterOrders({ status: "Active" }));
        }
    };

    return (
        <DashboardLayout
            title={table ? `Table ${table.table_number}` : "Table"}
            subtitle={table ? `${table.zone} · Seats ${table.seating_capacity}` : ""}
        >
            <button
                onClick={() => navigate("/waiter/tables")}
                className="flex items-center gap-1.5 text-sm text-charcoal/60 hover:text-ink mb-5 transition-colors"
            >
                <LuArrowLeft size={16} /> Back to floor plan
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
                {/* MENU PICKER */}
                <div>
                    <div className="flex flex-col sm:flex-row gap-3 mb-5">
                        <Input
                            placeholder="Search menu..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="sm:max-w-xs"
                        />
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${activeCategory === cat
                                        ? "bg-ink text-paper border-ink"
                                        : "bg-transparent text-charcoal/70 border-black/10 hover:border-ink/30"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {filteredMenu.length === 0 && !menuLoading ? (
                        <EmptyState title="No items found" subtitle="Try a different search or category." />
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {filteredMenu.map((item) => (
                                <button
                                    key={item._id}
                                    onClick={() => addToCart(item)}
                                    className="text-left rounded-xl border border-black/10 bg-paper p-3 hover:border-ember/40 hover:shadow-md transition-all"
                                >
                                    <p className="font-medium text-ink text-sm leading-snug line-clamp-2">
                                        {item.name}
                                    </p>
                                    <p className="font-mono text-ember font-semibold mt-1.5">
                                        ₹{item.price?.toFixed(2)}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* CART / EXISTING ORDER */}
                <div className="flex flex-col gap-5">
                    <TicketCard>
                        <h3 className="font-display text-lg text-ink mb-3">New Items</h3>

                        {cart.length === 0 ? (
                            <p className="text-sm text-charcoal/50 py-6 text-center">
                                Tap menu items to add them here.
                            </p>
                        ) : (
                            <ul className="divide-y divide-black/5 mb-4">
                                {cart.map((c) => (
                                    <li key={c.menu_item_id} className="py-2.5 flex items-center gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-ink truncate">{c.item_name}</p>
                                            <p className="font-mono text-xs text-charcoal/50">
                                                ₹{c.price.toFixed(2)} each
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => changeQty(c.menu_item_id, -1)}
                                                className="w-6 h-6 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5"
                                            >
                                                <LuMinus size={12} />
                                            </button>
                                            <span className="font-mono text-sm w-4 text-center">{c.quantity}</span>
                                            <button
                                                onClick={() => changeQty(c.menu_item_id, 1)}
                                                className="w-6 h-6 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5"
                                            >
                                                <LuPlus size={12} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(c.menu_item_id)}
                                            className="text-charcoal/30 hover:text-ember ml-1"
                                        >
                                            <LuTrash2 size={14} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-dashed border-black/10 mb-4">
                            <span className="text-sm text-charcoal/60">Subtotal</span>
                            <span className="font-mono text-lg font-semibold text-ink">
                                ₹{cartTotal.toFixed(2)}
                            </span>
                        </div>

                        <Button
                            className="w-full"
                            disabled={cart.length === 0}
                            loading={actionLoading}
                            onClick={handleSendToKitchen}
                        >
                            Send to Kitchen
                        </Button>
                    </TicketCard>

                    {existingOrder && (
                        <TicketCard>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-display text-lg text-ink">
                                    Current Order
                                </h3>
                                <Badge tone="ember">#{existingOrder.order_number}</Badge>
                            </div>
                            <ul className="divide-y divide-black/5">
                                {existingOrder.items?.map((item) => (
                                    <li key={item._id} className="py-2 flex items-center justify-between text-sm">
                                        <span className="text-charcoal">
                                            {item.quantity}× {item.item_name}
                                        </span>
                                        <Badge tone={itemStatusTone[item.status] || "muted"} size="sm">
                                            {item.status}
                                        </Badge>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex items-center justify-between pt-3 mt-2 border-t border-dashed border-black/10">
                                <span className="text-sm text-charcoal/60">Order total</span>
                                <span className="font-mono text-lg font-semibold text-ink">
                                    ₹{existingOrder.grand_total?.toFixed(2)}
                                </span>
                            </div>
                        </TicketCard>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default WaiterTableDetail;
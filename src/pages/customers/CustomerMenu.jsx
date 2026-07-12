import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import {
  LuPlus as Plus,
  LuMinus as Minus,
  LuShoppingBag as ShoppingBag,
  LuX as X,
  LuCircleCheck as CheckCircle,
  LuLeaf as Leaf,
} from "react-icons/lu";

import {
  getTableInfo,
  getPublicMenu,
  placeOrder,
  resetPlacedOrder,
} from "../../redux/publicMenu/publicMenuSlice";
import {
  addToCart,
  incrementQty,
  decrementQty,
  clearCart,
} from "../../redux/cart/cartSlice";
import { Input, Select } from "../../components/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

const FOOD_TYPE_DOT = {
  Veg: "border-basil text-basil",
  "Non-Veg": "border-claret text-claret",
  Egg: "border-saffron text-saffron",
};

const currency = (n) => `₹${Number(n || 0).toFixed(0)}`;

const CustomerMenu = () => {
  const { tableCode } = useParams();
  const dispatch = useDispatch();

  const { table, restaurant, menu, loading, error, placingOrder, placedOrder, orderError } =
    useSelector((state) => state.publicMenu);
  const { items: cartItems, totalAmount, totalQuantity } = useSelector((state) => state.cart);

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    payment_method: "Cash",
    special_instruction: "",
  });

  useEffect(() => {
    dispatch(getTableInfo(tableCode));
  }, [dispatch, tableCode]);

  useEffect(() => {
    if (restaurant?._id) {
      dispatch(getPublicMenu(restaurant._id));
    }
  }, [dispatch, restaurant]);

  const cartQty = (itemId) => cartItems.find((i) => i._id === itemId)?.quantity || 0;

  const handleAdd = (item) => {
    const effectivePrice = item.discount_price > 0 ? item.discount_price : item.price;
    dispatch(addToCart({ ...item, price: effectivePrice }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!form.customer_name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    const result = await dispatch(
      placeOrder({
        table_id: table._id,
        order_type: "Dine-In",
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        payment_method: form.payment_method,
        special_instruction: form.special_instruction,
        items: cartItems.map((i) => ({
          menu_item_id: i._id,
          quantity: i.quantity,
        })),
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      dispatch(clearCart());
      setCheckoutOpen(false);
      setCartOpen(false);
    } else {
      toast.error(result.payload || "Something went wrong placing your order.");
    }
  };

  const handleOrderAnother = () => {
    dispatch(resetPlacedOrder());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-6 text-center">
        <X size={40} className="text-claret mb-3" />
        <h1 className="font-display text-xl font-semibold text-ink mb-1">Can't load this menu</h1>
        <p className="text-sm text-slate">{error}</p>
      </div>
    );
  }

  if (placedOrder) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-6 text-center">
        <Toaster position="top-center" />
        <CheckCircle size={48} className="text-basil mb-4" />
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">Order placed!</h1>
        <p className="text-sm text-slate mb-1">Order #{placedOrder.order_number}</p>
        <p className="text-sm text-slate mb-6">Your order has been sent to the kitchen.</p>
        <Button onClick={handleOrderAnother}>Order something else</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper pb-24">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="bg-white border-b border-line px-5 py-5 text-center sticky top-0 z-10">
        <p className="text-xs uppercase tracking-widest text-slate font-semibold mb-1">
          {restaurant?.restaurant_name}
        </p>
        <h1 className="font-display text-xl font-semibold text-ink">
          Table {table?.table_number}
        </h1>
      </div>

      {/* Menu */}
      <div className="max-w-lg mx-auto px-4 py-5 space-y-8">
        {menu.length === 0 && (
          <p className="text-center text-sm text-slate py-16">
            This restaurant hasn't added any menu items yet.
          </p>
        )}

        {menu.map((category) => (
          <div key={category._id}>
            <h2 className="font-display text-lg font-semibold text-ink mb-3">
              {category.category_name}
            </h2>

            <div className="space-y-3">
              {category.items.map((item) => {
                const qty = cartQty(item._id);
                const effectivePrice = item.discount_price > 0 ? item.discount_price : item.price;

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl border border-line p-4 flex gap-3"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.item_name}
                        className="h-20 w-20 rounded-lg object-cover shrink-0"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <span
                          className={`mt-1 h-3.5 w-3.5 shrink-0 rounded-sm border-2 flex items-center justify-center ${FOOD_TYPE_DOT[item.food_type] || "border-slate"}`}
                        >
                          <Leaf size={7} className="fill-current" />
                        </span>
                        <h3 className="text-sm font-semibold text-ink">{item.item_name}</h3>
                      </div>

                      {item.description && (
                        <p className="text-xs text-slate mt-1 line-clamp-2">{item.description}</p>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-tabular text-sm font-semibold text-ink">
                          {currency(effectivePrice)}
                        </span>
                        {item.discount_price > 0 && (
                          <span className="font-tabular text-xs text-slate line-through">
                            {currency(item.price)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center">
                      {qty === 0 ? (
                        <Button size="sm" variant="outline" icon={Plus} onClick={() => handleAdd(item)}>
                          Add
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 bg-paper-dim rounded-lg px-1">
                          <button
                            onClick={() => dispatch(decrementQty(item._id))}
                            className="h-8 w-8 flex items-center justify-center text-ember"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-semibold text-ink w-4 text-center">{qty}</span>
                          <button
                            onClick={() => dispatch(incrementQty(item._id))}
                            className="h-8 w-8 flex items-center justify-center text-ember"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky cart bar */}
      {totalQuantity > 0 && !checkoutOpen && (
        <div className="fixed bottom-0 left-0 right-0 p-3 z-20">
          <button
            onClick={() => setCheckoutOpen(true)}
            className="max-w-lg mx-auto w-full bg-ember text-white rounded-xl px-5 py-4 flex items-center justify-between shadow-lg"
          >
            <span className="flex items-center gap-2 font-semibold text-sm">
              <ShoppingBag size={18} />
              {totalQuantity} item{totalQuantity !== 1 ? "s" : ""}
            </span>
            <span className="font-tabular font-semibold">{currency(totalAmount)} · View cart</span>
          </button>
        </div>
      )}

      {/* Checkout sheet */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-30 bg-ink/40 flex items-end sm:items-center sm:justify-center">
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-line sticky top-0 bg-white">
              <h2 className="font-display text-lg font-semibold text-ink">Your order</h2>
              <button onClick={() => setCheckoutOpen(false)}>
                <X size={20} className="text-slate" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-3">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between text-sm">
                  <span className="text-ink">{item.quantity} × {item.item_name}</span>
                  <span className="font-tabular text-ink">{currency(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between text-sm font-semibold border-t border-line pt-3">
                <span>Subtotal</span>
                <span className="font-tabular">{currency(totalAmount)}</span>
              </div>
              <p className="text-xs text-slate">Tax and service charge will be added at billing.</p>
            </div>

            <form onSubmit={handleSubmitOrder} className="px-5 pb-5 space-y-3 border-t border-line pt-4">
              <Input
                label="Your name"
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                placeholder="Name"
              />
              <Input
                label="Phone (optional)"
                value={form.customer_phone}
                onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                placeholder="Phone number"
              />
              <Select
                label="Payment method"
                value={form.payment_method}
                onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
              >
                <option value="Cash">Pay at table (Cash)</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </Select>

              <Button type="submit" fullWidth loading={placingOrder}>
                Place order · {currency(totalAmount)}
              </Button>
              {orderError && <p className="text-xs text-claret text-center">{orderError}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerMenu;
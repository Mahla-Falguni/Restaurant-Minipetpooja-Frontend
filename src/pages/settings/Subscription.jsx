import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuCheck, LuLayers, LuReceipt } from "react-icons/lu";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayouts";
import { Card } from "../../components/cards/StatCard";
import Badge from "../../components/kitchen/Badge";
import Button from "../../components/common/Button";
import EmptyState from "../../components/EmptyState";
import { formatCurrency, formatShortDate } from "../../utils/formatters";
import {
  getAvailablePlans,
  getMySubscription,
  subscribeToPlan,
  cancelSubscription,
  createSubscriptionOrder,
  verifySubscriptionPayment,
  getPaymentHistory,
} from "../../redux/subscription/subscriptionSlice";

/*
=========================================================
SUBSCRIPTION & BILLING
Free plans (price 0) activate instantly via subscribeToPlan.
Paid plans go through Razorpay: we create an order on the
backend, open Razorpay's Checkout widget, and only activate
the subscription after the backend verifies the payment
signature — the frontend never marks a plan "paid" on its own.
=========================================================
*/

const Subscription = () => {

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const {
    plans,
    mySubscription,
    payments,
    loading,
    subscribing,
    payingPlanId,
  } = useSelector((state) => state.subscription);

  useEffect(() => {
    dispatch(getAvailablePlans());
    dispatch(getMySubscription());
    dispatch(getPaymentHistory());
  }, [dispatch]);

  const currentPlanId = mySubscription?.plan_id?._id;

  const handleCancel = async () => {
    const result = await dispatch(cancelSubscription());
    if (cancelSubscription.fulfilled.match(result)) {
      toast.success("Subscription cancelled.");
    } else {
      toast.error(result.payload || "Failed to update.");
    }
  };

  const handleFreeSubscribe = async (planId) => {
    const result = await dispatch(subscribeToPlan(planId));
    if (subscribeToPlan.fulfilled.match(result)) {
      toast.success("Subscribed successfully.");
    } else {
      toast.error(result.payload || "Failed to subscribe.");
    }
  };

  const handlePaidSubscribe = async (plan) => {

    if (typeof window.Razorpay === "undefined") {
      toast.error("Payment gateway failed to load. Check your connection and refresh.");
      return;
    }

    const orderResult = await dispatch(createSubscriptionOrder(plan._id));

    if (!createSubscriptionOrder.fulfilled.match(orderResult)) {
      toast.error(orderResult.payload || "Could not start payment.");
      return;
    }

    const { order_id, amount, currency, key_id } = orderResult.payload;

    const razorpay = new window.Razorpay({

      key: key_id,

      amount,

      currency,

      order_id,

      name: "Petpooja",

      description: `${plan.plan_name} — ${plan.billing_cycle} subscription`,

      prefill: {
        name: user ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() : "",
        email: user?.email || "",
        contact: user?.phone || "",
      },

      theme: {
        color: "#e8542a",
      },

      handler: async (response) => {

        const verifyResult = await dispatch(verifySubscriptionPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }));

        if (verifySubscriptionPayment.fulfilled.match(verifyResult)) {
          toast.success("Payment successful. Subscription activated.");
          dispatch(getPaymentHistory());
        } else {
          toast.error(verifyResult.payload || "Payment verification failed.");
        }

      },

      modal: {
        ondismiss: () => {
          toast("Payment cancelled.", { icon: "ℹ️" });
        },
      },

    });

    razorpay.on("payment.failed", (response) => {
      toast.error(response.error?.description || "Payment failed. Please try again.");
    });

    razorpay.open();

  };

  const handleSubscribe = (plan) => {
    if (plan.price > 0) {
      handlePaidSubscribe(plan);
    } else {
      handleFreeSubscribe(plan._id);
    }
  };

  return (
    <DashboardLayout title="Subscription & Billing" subtitle="Choose the plan that fits your restaurant">

      {mySubscription && (
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="eyebrow mb-1">Current Plan</p>
              <h3 className="font-display text-xl font-semibold text-ink">
                {mySubscription.plan_id?.plan_name}
              </h3>
              <p className="text-sm text-slate mt-1">
                {formatCurrency(mySubscription.plan_id?.price)} / {mySubscription.plan_id?.billing_cycle}
                {" · "}renews {formatShortDate(mySubscription.current_period_end)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge>{mySubscription.status}</Badge>
              {mySubscription.auto_renew && (
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel subscription
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="text-sm text-slate">Loading plans…</div>
      ) : !plans?.length ? (
        <Card>
          <EmptyState icon={LuLayers} title="No plans available" description="Check back soon." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {plans.map((plan) => {
            const isCurrent = plan._id === currentPlanId;
            const isPaying = payingPlanId === plan._id;

            return (
              <Card key={plan._id} className="p-6" hoverable>

                <h3 className="font-display text-lg font-semibold text-ink mb-1">
                  {plan.plan_name}
                </h3>

                <p className="font-tabular text-2xl font-semibold text-ink mb-4">
                  {formatCurrency(plan.price)}
                  <span className="text-sm font-normal text-slate"> / {plan.billing_cycle}</span>
                </p>

                <dl className="text-sm space-y-1.5 mb-4">
                  <div className="flex justify-between">
                    <dt className="text-slate">Max branches</dt>
                    <dd className="text-ink">{plan.max_branches}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate">Max staff accounts</dt>
                    <dd className="text-ink">{plan.max_staff_accounts}</dd>
                  </div>
                </dl>

                {plan.features_included?.length > 0 && (
                  <ul className="space-y-1.5 mb-5">
                    {plan.features_included.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-charcoal">
                        <LuCheck size={14} className="text-basil" /> {f}
                      </li>
                    ))}
                  </ul>
                )}

                <Button
                  fullWidth
                  variant={isCurrent ? "outline" : "primary"}
                  disabled={isCurrent}
                  loading={isPaying || (subscribing && !plan.price)}
                  onClick={() => handleSubscribe(plan)}
                >
                  {isCurrent ? "Current Plan" : plan.price > 0 ? "Subscribe & Pay" : "Subscribe"}
                </Button>

              </Card>
            );
          })}
        </div>
      )}

      <Card className="p-6">
        <h3 className="font-display text-base font-semibold text-ink mb-1">
          Payment history
        </h3>
        <p className="text-xs text-slate mb-5">Every successful payment made for this restaurant</p>

        {!payments?.length ? (
          <EmptyState icon={LuReceipt} title="No payments yet" description="Paid plan subscriptions will show up here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-line">
                  <th className="py-2 font-semibold text-slate">Date</th>
                  <th className="py-2 font-semibold text-slate">Plan</th>
                  <th className="py-2 font-semibold text-slate">Amount</th>
                  <th className="py-2 font-semibold text-slate">Payment ID</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} className="border-b border-line last:border-0">
                    <td className="py-2 text-ink">{formatShortDate(p.createdAt)}</td>
                    <td className="py-2 text-charcoal">{p.plan_id?.plan_name}</td>
                    <td className="py-2 text-charcoal">{formatCurrency(p.amount)}</td>
                    <td className="py-2 text-slate text-xs font-mono">{p.razorpay_payment_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

    </DashboardLayout>
  );

};

export default Subscription;
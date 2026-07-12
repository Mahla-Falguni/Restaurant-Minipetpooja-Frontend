import { motion } from "framer-motion";
import { LuUtensilsCrossed, LuReceipt, LuChefHat } from "react-icons/lu";

/*
=========================================
AUTH LAYOUT
Split-screen shell for Login / Register.
Left: branding panel (ink). Right: form panel (paper).
=========================================
*/

const AuthLayout = ({ eyebrow, title, subtitle, children }) => {
    return (
        <div className="min-h-screen flex bg-paper">
            {/* LEFT — BRANDING PANEL */}
            <div className="hidden lg:flex lg:w-[42%] relative bg-ink text-paper overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, #FAF8F5 1.4px, transparent 1.4px)",
                        backgroundSize: "20px 20px",
                    }}
                />

                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex items-center gap-2.5"
                    >
                        <div className="w-9 h-9 rounded-lg bg-ember flex items-center justify-center">
                            <LuUtensilsCrossed size={18} className="text-white" />
                        </div>
                        <span className="font-display text-lg font-semibold tracking-tight">
                            Restaurant POS
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="max-w-sm"
                    >
                        <span className="eyebrow text-ember-light/80">Front-of-house, sorted</span>
                        <h1 className="font-display text-4xl font-semibold leading-[1.15] mt-3 mb-4">
                            Every table, ticket, and till — in one place.
                        </h1>
                        <p className="text-paper/60 text-[15px] leading-relaxed">
                            Manage orders, kitchen tickets, cashier billing, and staff shifts
                            without switching screens.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        className="flex items-center gap-6 text-paper/50 text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <LuReceipt size={16} />
                            <span>Live billing</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <LuChefHat size={16} />
                            <span>Kitchen sync</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* RIGHT — FORM PANEL */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    {/* Mobile-only logo (branding panel is hidden below lg) */}
                    <div className="flex lg:hidden items-center gap-2.5 mb-8 justify-center">
                        <div className="w-8 h-8 rounded-lg bg-ember flex items-center justify-center">
                            <LuUtensilsCrossed size={16} className="text-white" />
                        </div>
                        <span className="font-display text-base font-semibold text-ink">
                            Restaurant POS
                        </span>
                    </div>

                    {eyebrow && <span className="eyebrow text-ember block mb-2">{eyebrow}</span>}
                    <h2 className="font-display text-2xl font-semibold text-ink mb-1.5">
                        {title}
                    </h2>
                    {subtitle && <p className="text-sm text-slate mb-8">{subtitle}</p>}

                    {children}
                </motion.div>
            </div>
        </div>
    );
};

export default AuthLayout;
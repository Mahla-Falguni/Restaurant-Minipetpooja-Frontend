/*
=========================================================
TICKET CARD
=========================================================
*/

const toneBorderMap = {
    default: "border-black/10",
    ember: "border-ember/30",
    success: "border-basil/30",
    warning: "border-saffron/40",
    muted: "border-black/5"
};

const toneTopBarMap = {
    default: "bg-transparent",
    ember: "bg-ember",
    success: "bg-basil",
    warning: "bg-saffron",
    muted: "bg-black/10"
};

const Perforation = ({ position }) => (
    <div
        className={`absolute left-0 right-0 flex justify-between px-3 pointer-events-none ${position === "top" ? "-top-2" : "-bottom-2"
            }`}
        aria-hidden="true"
    >
        {Array.from({ length: 14 }).map((_, i) => (
            <span
                key={i}
                className="w-2 h-2 rounded-full bg-[#F4F1EC]"
                style={{
                    boxShadow:
                        position === "top"
                            ? "inset 0 -1px 1px rgba(0,0,0,0.06)"
                            : "inset 0 1px 1px rgba(0,0,0,0.06)"
                }}
            />
        ))}
    </div>
);

export const TicketCard = ({
    children,
    tone = "default",
    className = "",
    perforated = true,
    ...props
}) => {
    return (
        <div
            className={`relative rounded-2xl border bg-paper shadow-sm hover:shadow-md transition-shadow duration-200 overflow-visible ${toneBorderMap[tone]} ${className}`}
            {...props}
        >
            {tone !== "default" && (
                <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl ${toneTopBarMap[tone]}`} />
            )}

            {perforated && <Perforation position="top" />}

            <div className={`p-5 ${tone !== "default" ? "pt-6" : ""}`}>
                {children}
            </div>

            {perforated && <Perforation position="bottom" />}
        </div>
    );
};

export default TicketCard;
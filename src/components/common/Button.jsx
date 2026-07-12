import { motion } from "framer-motion";

/*
=========================================
BUTTON
Variants: primary (ember), dark (ink), outline, ghost, danger
=========================================
*/

const variantStyles = {
  primary: "bg-ember text-white hover:bg-ember-dark shadow-sm shadow-ember/20",
  dark: "bg-ink text-white hover:bg-ink-soft",
  outline: "bg-transparent text-ink border border-line hover:bg-paper-dim",
  ghost: "bg-transparent text-slate hover:bg-paper-dim hover:text-ink",
  danger: "bg-claret text-white hover:bg-claret/90",
  success: "bg-basil text-white hover:bg-basil/90"
};

const sizeStyles = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base"
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
  ...rest
}) => {

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg font-semibold transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...rest}
    >

      {loading && (
        <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
      )}

      {!loading && Icon && iconPosition === "left" && <Icon size={17} />}
      {children}
      {!loading && Icon && iconPosition === "right" && <Icon size={17} />}

    </motion.button>
  );

};

export default Button;
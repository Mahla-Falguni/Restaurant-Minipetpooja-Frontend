const LoadingButton = ({
    loading,
    children,
    className,
    ...props
}) => {

    return (
        <button
            {...props}
            disabled={loading}
            className={` flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed
                ${className} `}>
            {
                loading && (
                    <span
                        className=" w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                    />)
            }
            {children}
        </button>
    );
};

export default LoadingButton;
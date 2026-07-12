/*
=========================================
FORMATTERS
Small shared helpers for money, dates, and relative time —
used across the dashboard widgets so numbers look consistent.
=========================================
*/

export const formatCurrency = (value) => {

    const amount = Number(value) || 0;

    return `₹${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;

};

export const formatCompactNumber = (value) => {
    const num = Number(value) || 0;
    return num.toLocaleString("en-IN");
};

export const formatShortDate = (dateStr) => {
    const date = new Date(dateStr);

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
    });

};

export const formatTime = (dateStr) => {
    const date = new Date(dateStr);

    return date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
    });

};

export const formatRelativeTime = (dateStr) => {

    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;

};

export const getGreeting = () => {

    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";

};
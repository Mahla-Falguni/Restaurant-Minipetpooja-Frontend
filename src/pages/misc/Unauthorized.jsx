import { Link } from "react-router-dom";
import { LuShieldAlert } from "react-icons/lu";
import Button from "../../components/common/Button";

const Unauthorized = () => {
    return (
        <div className="min-h-screen bg-paper flex items-center justify-center px-6">
            <div className="text-center max-w-sm">
                <div className="w-16 h-16 rounded-full bg-ember/10 text-ember flex items-center justify-center mx-auto mb-5">
                    <LuShieldAlert size={28} />
                </div>
                <h1 className="font-display text-2xl text-ink mb-2">Access Denied</h1>
                <p className="text-charcoal/60 mb-6">
                    You don't have permission to view this page. If you think this is a mistake, contact your manager.
                </p>
                <Link to="/">
                    <Button>Back to Dashboard</Button>
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;
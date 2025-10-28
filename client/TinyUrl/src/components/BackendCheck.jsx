import { useEffect, useState } from "react";

const BackendCheck = ({ children }) => {
    const [isBackendUp, setIsBackendUp] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkBackend = async () => {
            try {
                const res = await fetch(import.meta.env.VITE_SERVER_BASE_URL + "/healthy");

                const data = await res.json();
                if (data.success) {
                    setIsBackendUp(true);
                    setLoading(false);
                    return;
                }

            } catch (err) {
                console.warn("Backend not reachable, retrying...");
            }
            setTimeout(checkBackend, 5000);
        };

        checkBackend();
    }, []);

    if (loading || !isBackendUp) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
                <div className="animate-spin h-10 w-10 border-4 border-t-transparent border-white rounded-full mb-3"></div>
                <p>Connecting to server...</p>
            </div>
        );
    }

    return children;
};

export default BackendCheck;

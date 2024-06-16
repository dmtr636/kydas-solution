import { observer } from "mobx-react-lite";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SnackbarProvider } from "src/ui/components/info/Snackbar/SnackbarProvider.tsx";
import { useEffect, useState } from "react";
import { store } from "src/app/AppStore.ts";
import { LoadingScreen } from "src/ui/components/segments/LoadingScreen/LoadingScreen.tsx";

export const AppRoot = observer(() => {
    const [ready, setReady] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const onMount = async () => {
            if (!location.pathname.startsWith("/request")) {
                const isAuthenticated = await store.account.authenticate();
                if (!isAuthenticated) {
                    navigate("/auth/login", { replace: true });
                } else if (
                    store.account.currentUser?.role !== "EMPLOYEE" &&
                    !location.pathname.startsWith("/admin")
                ) {
                    navigate("/admin", { replace: true });
                } else if (
                    store.account.currentUser?.role === "EMPLOYEE" &&
                    !location.pathname.startsWith("/staffapp")
                ) {
                    navigate("/staffapp", { replace: true });
                }
            }
            setReady(true);
        };
        onMount();
    }, []);

    return (
        <>
            {ready ? <Outlet /> : <LoadingScreen />}
            <SnackbarProvider />
        </>
    );
});

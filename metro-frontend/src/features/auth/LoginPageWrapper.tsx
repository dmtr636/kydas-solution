import { LoginPage } from "src/ui/components/pages/login/LoginPage/LoginPage.tsx";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { store } from "src/app/AppStore.ts";

export const LoginPageWrapper = observer(() => {
    const navigate = useNavigate();

    return (
        <LoginPage
            onLogin={() =>
                store.account.currentUser?.role === "EMPLOYEE"
                    ? navigate("/staffapp")
                    : navigate("/admin")
            }
            recover={false}
        />
    );
});

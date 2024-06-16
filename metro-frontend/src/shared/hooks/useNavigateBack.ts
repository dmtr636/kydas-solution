import { useNavigate } from "react-router-dom";

export const useNavigateBack = () => {
    const navigate = useNavigate();

    return (options?: { default: string }) => {
        if (window.history?.length && window.history.length > 1) {
            navigate(-1);
        } else {
            navigate(options?.default ?? "/", { replace: true });
        }
    };
};

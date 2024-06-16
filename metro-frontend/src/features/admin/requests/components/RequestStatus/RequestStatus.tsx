import { IRequest } from "src/features/admin/requests/types/IRequest.ts";
import { Status, StatusProps } from "src/ui/components/info/Status/Status.tsx";
import { ReactNode } from "react";
import {
    IconAttention,
    IconError,
    IconPlay,
    IconReview,
    IconSuccess,
    IconTime,
} from "src/ui/assets/icons";
import { requestStatuses } from "src/features/admin/requests/constants/requestStatuses.ts";
import { Tooltip } from "src/ui/components/info/Tooltip/Tooltip.tsx";

export const RequestStatus = (props: {
    request: Pick<IRequest, "status"> & { lockedEdit?: boolean | null };
    autoShowTooltip?: boolean;
}) => {
    const modeMap: Record<IRequest["status"], StatusProps["mode"]> = {
        NEW: "warning",
        CONFIRMED: "accent",
        COMPLETED: "positive",
        CANCELED: "negative",
        UNDER_CONSIDERATION: "accent",
        WAITING_LIST: "neutral",
    };
    const iconMap: Record<IRequest["status"], ReactNode> = {
        NEW: <IconAttention />,
        CONFIRMED: <IconPlay />,
        COMPLETED: <IconSuccess />,
        CANCELED: <IconError />,
        UNDER_CONSIDERATION: <IconReview />,
        WAITING_LIST: <IconTime />,
    };
    if (props.request.lockedEdit) {
        return (
            <Tooltip
                header={"Уже рассматривается"}
                text={"С заявкой работает другой оператор"}
                autoCloseDelay={3000}
                mode={"neutral"}
                show={props.autoShowTooltip}
            >
                <Status
                    iconBefore={iconMap["UNDER_CONSIDERATION"]}
                    mode={modeMap["UNDER_CONSIDERATION"]}
                    size={"small"}
                >
                    {requestStatuses["UNDER_CONSIDERATION"]}
                </Status>
            </Tooltip>
        );
    }
    return (
        <Status
            iconBefore={iconMap[props.request.status]}
            mode={modeMap[props.request.status]}
            size={"small"}
        >
            {requestStatuses[props.request.status]}
        </Status>
    );
};

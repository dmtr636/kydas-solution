import styles from "./AdminPageContentLayout.module.scss";
import { Header } from "src/ui/components/segments/Header/Header.tsx";
import { ReactNode } from "react";
import { Avatar } from "src/ui/components/solutions/Avatar/Avatar.tsx";
import { useNavigate } from "react-router-dom";
import { store } from "src/app/AppStore.ts";
import { Helmet } from "react-helmet";
import { BreadCrumb, BreadCrumbs } from "src/ui/components/solutions/Breadcrumbs/BreadCrumbs.tsx";
import { Notification } from "src/ui/components/solutions/Notification/Notification.tsx";
import { observer } from "mobx-react-lite";
import { requestStatuses } from "src/features/admin/requests/constants/requestStatuses.ts";
import { notificationActions } from "src/features/admin/notifications/constants/notificationActions.ts";

interface AdminPageLayoutProps {
    title: string;
    children: ReactNode;
    actions?: ReactNode[];
    breadCrumbs?: BreadCrumb[];
}

export const ADMIN_PAGE_CONTENT_LAYOUT_ID = "ADMIN_PAGE_CONTENT_LAYOUT";

export const AdminPageContentLayout = observer((props: AdminPageLayoutProps) => {
    const { title, children, actions, breadCrumbs }: AdminPageLayoutProps = props;
    const navigate = useNavigate();

    const logout = () => {
        navigate("/auth/login");
        store.account.logout();
    };

    const renderAvatar = () => (
        <Avatar
            userName={store.account.currentUser?.name ?? undefined}
            dropdownListOptions={[
                {
                    name: "Выйти",
                    onClick: logout,
                },
            ]}
        />
    );

    return (
        <div className={styles.layout} id={ADMIN_PAGE_CONTENT_LAYOUT_ID}>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <Header
                title={breadCrumbs ? <BreadCrumbs breadCrumbsArray={breadCrumbs} /> : title}
                notification={
                    <Notification
                        notifications={store.notification.requiredAttentionNotifications.map(
                            (n) => ({
                                id: n.id,
                                date: n.createDate,
                                text:
                                    notificationActions[
                                        n.action as keyof typeof notificationActions
                                    ] +
                                    (n.action === "CHANGE_STATUS"
                                        ? `«${requestStatuses[n.status]}»`
                                        : ""),
                            }),
                        )}
                        onNotificationClick={(n) => {
                            const notification = store.notification.findById(n.id);
                            if (notification) {
                                navigate(`/admin/requests/${notification?.requestId}/history`);
                                notification.isRead = true;
                                store.notification.updateNotification(notification);
                            }
                        }}
                        onAllNotificationsClick={() => navigate("/admin/notifications")}
                    />
                }
                avatar={renderAvatar()}
                actions={actions}
                sticky={true}
            />
            <div className={styles.content}>{children}</div>
        </div>
    );
});

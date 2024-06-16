import { observer } from "mobx-react-lite";
import { AdminPageContentLayout } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { IconPlus } from "../../../../ui/assets/icons";
import { Card } from "src/ui/components/solutions/Card/Card.tsx";
import { useEffect, useState } from "react";
import { UserList } from "../components/UserList/UserList.tsx";
import { UserAddDialog } from "../components/UserAddDialog/UserAddDialog.tsx";
import { store } from "src/app/AppStore.ts";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { User } from "src/features/admin/users/types/User.ts";
import { UserEditDialog } from "src/features/admin/users/components/UserEditDialog/UserEditDialog.tsx";
import { Exploration } from "src/ui/components/segments/Exploration/Exploration.tsx";
import { userSortOptions } from "src/features/admin/users/constants/userSortOptions.ts";
import { Tabs } from "src/ui/components/solutions/Tabs/Tabs.tsx";
import styles from "./UsersPage.module.scss";

export const UsersPage = observer(() => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    useEffect(() => {
        if (store.user.search) {
            store.user.tab = "all";
        }
    }, [store.user.search]);

    return (
        <AdminPageContentLayout
            title={"Доступ в систему"}
            actions={[
                <Button
                    key={"add"}
                    type={"secondary"}
                    iconBefore={<IconPlus />}
                    onClick={() => setShowAddDialog(true)}
                >
                    Выдать доступ
                </Button>,
            ]}
        >
            <Exploration
                inputPlaceholder={"Поиск по имени и почте пользователя"}
                onInputChange={(value) => store.user.setSearch(value)}
                inputValue={store.user.search}
                sortOptions={userSortOptions}
                sortValue={store.user.sort}
                onSortChange={(value) => store.user.setSort(value)}
            />
            <Card>
                <div className={styles.tabs}>
                    <Tabs
                        tabs={[
                            {
                                name: "Все пользователи",
                                value: "all",
                            },
                            {
                                name: "Администраторы",
                                value: "administrator",
                            },
                            {
                                name: "Специалисты",
                                value: "specialist",
                            },
                            {
                                name: "Операторы",
                                value: "operator",
                            },
                        ]}
                        value={store.user.tab}
                        onChange={(v) => (store.user.tab = v)}
                    />
                </div>
                <UserList
                    onEditClick={(user) => {
                        setEditingUser(user);
                        setShowEditDialog(true);
                    }}
                />
            </Card>
            <UserAddDialog open={showAddDialog} setOpen={setShowAddDialog} />
            <UserEditDialog
                open={showEditDialog}
                setOpen={setShowEditDialog}
                initialValues={editingUser}
            />
        </AdminPageContentLayout>
    );
});

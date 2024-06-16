import styles from "./UserList.module.scss";
import { observer } from "mobx-react-lite";
import { UserCard } from "src/ui/components/solutions/UserCard/UserCard.tsx";
import { store } from "src/app/AppStore.ts";
import { userRoles } from "../../constants/userRoles.ts";
import { User } from "src/features/admin/users/types/User.ts";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";

export const UserList = observer((props: { onEditClick?: (user: User) => void }) => {
    return (
        <div className={styles.grid}>
            {store.user.filteredUsers.map((user) => (
                <UserCard
                    email={user.email}
                    role={userRoles[user.role]}
                    fullName={user.name}
                    onEditClick={user.role !== "ROOT" ? () => props.onEditClick?.(user) : undefined}
                    key={user.id}
                />
            ))}
            {!store.user.filteredUsers.length && (
                <Typo variant={"subheadXL"} className={styles.emptyList}>
                    Ничего не найдено
                </Typo>
            )}
        </div>
    );
});

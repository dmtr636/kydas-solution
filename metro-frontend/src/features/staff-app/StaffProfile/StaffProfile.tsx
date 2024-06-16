import styles from "./styles.module.scss";
import { Chip } from "src/ui/components/controls/Chip/Chip.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { IconAvatar } from "src/ui/assets/icons";
import { observer } from "mobx-react-lite";
import { store } from "src/app/AppStore.ts";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFullName } from "src/shared/utils/getFullName.ts";

const StaffProfile = observer(() => {
    const data = store.employee.getCurrentAuthenticatedEmployee();
    const skillsArray = data?.tags.map((skill) => <Chip key={skill}>{skill}</Chip>);
    useEffect(() => {
        store.employee.fetchAllEmployees();
    }, []);

    function formatNumber(number: string | number | undefined): any {
        if (number) {
            const numberString = String(number);
            const firstPart = numberString.slice(0, 4);
            const secondPart = numberString.slice(4);
            return `${firstPart}-${secondPart}`;
        }
    }

    function getWeekDayRange() {
        const currentDate = new Date();
        const currentDayOfWeek = currentDate.getDay();

        switch (currentDayOfWeek) {
            case 1:
                return data?.timeWorkStart1 && data?.timeWorkEnd1
                    ? `${data.timeWorkStart1}-${data.timeWorkEnd1}`
                    : "выходной";
            case 2:
                return data?.timeWorkStart2 && data?.timeWorkEnd2
                    ? `${data.timeWorkStart2}-${data.timeWorkEnd2}`
                    : "выходной";
            case 3:
                return data?.timeWorkStart3 && data.timeWorkEnd3
                    ? `${data.timeWorkStart3}-${data.timeWorkEnd3}`
                    : "выходной";
            case 4:
                return data?.timeWorkStart4 && data.timeWorkEnd4
                    ? `${data.timeWorkStart4}-${data.timeWorkEnd4}`
                    : "выходной";
            case 5:
                return data?.timeWorkStart5 && data.timeWorkEnd5
                    ? `${data.timeWorkStart5}-${data.timeWorkEnd5}`
                    : "выходной";
            case 6:
                return data?.timeWorkStart6 && data?.timeWorkEnd6
                    ? `${data.timeWorkStart6}-${data.timeWorkEnd6}`
                    : "выходной";
            default:
                return data?.timeWorkStart7 && data?.timeWorkEnd7
                    ? `${data.timeWorkStart7}-${data.timeWorkEnd7}`
                    : "выходной";
        }
    }

    const navigate = useNavigate();
    return (
        <div className={styles.container}>
            <div className={styles.block}>
                <div className={styles.userInfoBlock}>
                    <IconAvatar />
                    <div className={styles.user}>
                        <div className={styles.username}>
                            {data?.lastName} {data?.firstName[0]}. {data?.patronymic[0]}.
                        </div>
                        <div className={styles.usermale}>
                            {data?.position === "ЦСИ" ? "Старший инспектор" : "Инспектор"}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.block}>
                <div className={styles.blockText}>Табельный номер</div>
                <div className={styles.blocksubText}>{formatNumber(data?.number)}</div>
            </div>
            <div className={styles.block}>
                <div className={styles.blockText}>Время работы</div>
                <div className={styles.blocksubText}>{getWeekDayRange()}</div>
                <div className={styles.divider}></div>
                <div className={styles.blockText}>Закреплён за участком</div>
                <div className={styles.blocksubText}>{data?.area}</div>
                <div className={styles.divider}></div>
                <div className={styles.blockText}>Руководитель участка</div>
                <div className={styles.blocksubText}>{data?.supervisor}</div>
            </div>
            {skillsArray && skillsArray.length > 0 ? (
                <div className={styles.block}>
                    <div className={styles.skills}>{skillsArray}</div>
                </div>
            ) : (
                <></>
            )}
            <div className={styles.button}>
                <Button
                    onClick={() => {
                        store.account.logout();
                        navigate("/auth/login");
                    }}
                    mode={"brand"}
                    type={"outlined"}
                    fullWidth={true}
                    size={"large"}
                >
                    Выйти из аккаунта
                </Button>
            </div>
        </div>
    );
});

export default StaffProfile;

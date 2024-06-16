import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { IconCheckmark } from "src/ui/assets/icons";

const LunchCard = ({ lunchTime, index }: { lunchTime: string; index: number }) => {
    const [lunchTimeEnd, setLunchEnd] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number }>({
        minutes: 0,
        seconds: 0,
    });
    const [isLunchStarted, setIsLunchStarted] = useState<boolean>(false);

    const [lunchStart, lunchEnd] = lunchTime.split("-");

    const parseTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    };

    const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const endTime = parseTime(lunchEnd).getTime();
        const difference = endTime - now;

        let timeLeft = {
            minutes: 0,
            seconds: 0,
        };

        if (difference > 0) {
            timeLeft = {
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        } else {
            if (!lunchTimeEnd) {
                // Avoid re-setting state if already ended
                setLunchEnd(true);
            }
        }

        return timeLeft;
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const lunchStartTime = parseTime(lunchStart);

            // Update isLunchStarted state
            setIsLunchStarted(lunchStartTime <= now);

            // Update timeLeft only if lunch has started
            if (isLunchStarted) {
                setTimeLeft(calculateTimeLeft());
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [lunchStart, lunchEnd, isLunchStarted]);
    return (
        <div className={styles.block}>
            <div className={styles.blockHead}>
                Перерыв на обед
                <Button mode={"neutral"} clickable={false} type={"outlined"} size={"small"}>
                    {lunchStart}
                </Button>
            </div>
            <>
                {(!isLunchStarted || index !== 0) && (
                    <div className={styles.blockText}>
                        Время на обед <span>{lunchTime}</span>
                    </div>
                )}

                {isLunchStarted && index === 0 && (
                    <>
                        {lunchTimeEnd ? (
                            <Button
                                clickable={false}
                                type={"outlined"}
                                mode={"brand"}
                                iconAfter={<IconCheckmark />}
                            >
                                Завершён
                            </Button>
                        ) : (
                            <Button clickable={false} type={"outlined"} mode={"brand"}>
                                {" "}
                                {timeLeft.minutes}:
                                {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
                            </Button>
                        )}
                    </>
                )}
            </>
        </div>
    );
};

export default LunchCard;

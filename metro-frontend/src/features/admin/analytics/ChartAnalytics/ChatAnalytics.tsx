// TimeDistributionChart.js
import React from "react";
import styles from "./TimeDistributionChart.module.scss";
import { Tooltip } from "src/ui/components/info/Tooltip/Tooltip.tsx";

const TimeDistributionChart = ({ data, total }: { data: any; total: number }) => {
    // Вычисляем максимальное количество запросов для нормализации высоты столбцов

    return (
        <div className={styles.qwe}>
            <div className={styles.chartContainer}>
                {data.map((item: any) => (
                    <div key={item.hour} className={styles.chartColumn}>
                        <Tooltip
                            textCenter={true}
                            tipPosition={"bottom-center"}
                            mode={"neutral"}
                            header={item.requests}
                        >
                            <div
                                className={styles.chartBar}
                                style={{ height: `${(item.requests / total) * 400}%` }}
                            ></div>
                        </Tooltip>
                    </div>
                ))}
            </div>
            <div className={styles.labelArray}>
                {data.map((item: any) => (
                    <span key={item.hour} className={styles.chartLabel}>
                        {item.hour}
                    </span>
                ))}
            </div>
            <div className={styles.percentArray}>
                {data.map((item: any) => (
                    <span key={item.hour} className={styles.percent}>
                        {((item.requests / total) * 100).toFixed(0)}%
                    </span>
                ))}
            </div>
        </div>
    );
};

export default TimeDistributionChart;

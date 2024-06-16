import styles from "./styles.module.scss";
import { HeaderRequest } from "src/features/request/HeaderRequest/HeaderRequest.tsx";
import InfoBlock from "src/features/request/RequestForm/InfoBlock/InfoBlock.tsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { domain } from "src/shared/config/domain.ts";
import { REQUEST_INFO_ENDPOINT } from "src/shared/api/endpoints.ts";
import RequestInfo from "src/features/request/RequestInfo/RequestInfo.tsx";
import { LoadingScreen } from "src/ui/components/segments/LoadingScreen/LoadingScreen.tsx";
import { Helmet } from "react-helmet";

const RequestInfoPage = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>();
    const { id } = useParams();

    async function getInfo() {
        setLoading(true);
        const response = await axios.get(`${REQUEST_INFO_ENDPOINT}${id}`);

        setData(response.data);
        setLoading(false);
    }

    useEffect(() => {
        getInfo();
    }, []);

    return (
        <div className={styles.container}>
            <Helmet>
                <title>Информация о заявке</title>
            </Helmet>
            <HeaderRequest />
            {data ? (
                <div className={styles.content}>
                    <RequestInfo data={data} />
                    <InfoBlock />
                </div>
            ) : (
                <LoadingScreen></LoadingScreen>
            )}
        </div>
    );
};
export default RequestInfoPage;

import { observer } from "mobx-react-lite";
import { HeaderRequest } from "src/features/request/HeaderRequest/HeaderRequest.tsx";
import styles from "./styles.module.scss";
import RequestForm from "src/features/request/RequestForm/RequestForm.tsx";
import { Helmet } from "react-helmet";

export const RequestPage = observer(() => {
    return (
        <div className={styles.pagecontainer}>
            <Helmet>
                <title>Составление заявки</title>
            </Helmet>
            <HeaderRequest />
            <RequestForm />
        </div>
    );
});

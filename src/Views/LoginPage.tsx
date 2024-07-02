import LoginCard from '../Components/login/LoginCard.tsx';
import {ProCard} from "@ant-design/pro-components";

const LoginForm = () => {

    return (
        <>
            <ProCard
            title="登录"
            headerBordered
            style={{
                width: 500,
                margin: "auto",
                marginTop: "10%",
                padding: 30
            }}
            >
                <LoginCard />
            </ProCard>
        </>
    );
};

export default LoginForm;
import LoginCard from '../plugins/login/LoginCard.tsx';
import {ProCard} from "@ant-design/pro-components";
import React from "react";

const LoginForm = ({ setlogined } : {setlogined :  React.Dispatch<React.SetStateAction<boolean>>}) => {

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
                <LoginCard setlogined={setlogined}/>
            </ProCard>
        </>
    );
};

export default LoginForm;
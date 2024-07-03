import { Result, Button } from 'antd';
import { useEffect, useState } from "react";
import { config } from "../config.tsx";

const BackendOfflinePage = () => {
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkBackend = () => {
            fetch(config.API_URL + "/api/v1/ping", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include"
            })
            .then(() => {
                window.location.href = "/";
            })
            .catch(() => {
                setIsChecking(false);
            });
        };

        checkBackend();

        // 设置定期检查
        const intervalId = setInterval(checkBackend, 5000); // 每5秒检查一次

        // 清理函数
        return () => clearInterval(intervalId);
    }, []);

    return (
        <Result
            status="error"
            title="后端服务未启动"
            subTitle={isChecking ? "正在尝试连接后端..." : "错误，后端服务目前无法连接，请检查后端情况。"}
            extra={[
                <Button
                    type="primary"
                    key="retry"
                    onClick={() => window.location.reload()}
                    loading={isChecking}
                >
                    {isChecking ? "正在重试" : "重试"}
                </Button>
            ]}
        />
    );
};

export default BackendOfflinePage;
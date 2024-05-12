import {Card, Button} from "antd"
import {useContext, useState} from "react";
import {ConfigContext} from "../../config.tsx";
import {LoadingOutlined, PoweroffOutlined, RedoOutlined} from '@ant-design/icons';

// Plugin 电源插件 开机关机
export default function PowerControl() {
    const config = useContext(ConfigContext);
    const getApiUrl = (endpoint: string) => `${config?.API_URL}/api/v1/${endpoint}`;

    const [isPowerOn, setPowerStatus] = useState(true)

    const shutdown = async () => {
        if (isPowerOn) {
            const response = await fetch(getApiUrl("power/shutdown"));
            if (response.ok) {
                setPowerStatus(false);
            }
        }
    }

    const reboot = async () => {
        if (isPowerOn) {
            const response = await fetch(getApiUrl("power/reboot"));
            if (response.ok) {
                setPowerStatus(false);
            }
        }
    }

    const powerOnButtons = (
        <>
            <Button type="primary" onClick={shutdown} icon={<PoweroffOutlined/>}>{"关机"}</Button>
            <Button type="primary" onClick={reboot} icon={<RedoOutlined/>}>{"重启"}</Button>
        </>
    )

    const powerOffStatus = <span><LoadingOutlined id="loadingicon"/> {"关机中..."}</span>

    return (
        <>
            {/* 电源操作 */}
            <Card id="Power" className="card" title="电源操作">
                {isPowerOn ? powerOnButtons : powerOffStatus}
            </Card>
        </>
    )
}
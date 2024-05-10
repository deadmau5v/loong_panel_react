import {Card, Button} from "antd"
import {useContext, useState} from "react";
import {ConfigContext} from "../../config.tsx";
import {LoadingOutlined, PoweroffOutlined, RedoOutlined} from '@ant-design/icons';

// Plugin 电源插件 开机关机
export default function Plugin() {
    const config = useContext(ConfigContext);
    const RebootAPI = config?.API_URL + "/api/v1/power/reboot"
    const ShutdownAPI = config?.API_URL + "/api/v1/power/shutdown"

    const [status, setStatus] = useState(true)

    function Shutdown() {
        if (status) {
            fetch(ShutdownAPI).then(() => {
                setStatus(false)
            })
        }
    }

    function Reboot() {
        if (status) {
            fetch(RebootAPI).then(() => {
                setStatus(false)
            })
        }
    }

    const powerOn = (
        <>
            <Button type="primary" onClick={Shutdown} icon={
                <PoweroffOutlined/>

            }>{"关机"}</Button>
            <Button type="primary" onClick={Reboot} icon={
                <RedoOutlined/>
            }>{"重启"}</Button>
        </>
    )

    const powerOff = <span>
        <LoadingOutlined id="loadingicon"/> {"关机中..."}
    </span>

    return (
        <>
            {/* 电源操作 */}
            <Card id="Power" className="card" title="电源操作">
                {
                    status ? powerOn : powerOff
                }
            </Card>
        </>
    )
}
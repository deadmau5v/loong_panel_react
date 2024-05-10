import {Card, Descriptions} from "antd";
import {ConfigContext} from "../../config.tsx";
import {useContext, useEffect, useState} from "react";

export default function Plugin() {
    const config = useContext(ConfigContext);
    const API = config?.API_URL + "/api/v1/status/system_info"
    const [system_arch, system_arch_setter] = useState("")
    const [system_public_ip, system_public_ip_setter] = useState("")
    const [system_cpu_name, system_cpu_name_setter] = useState("")
    const [system_linux_version, system_linux_version_setter] = useState("")
    const [system_run_time, system_run_time_setter] = useState("")
    useEffect(() => {
        fetch(API)
            .then(res => res.json())
            .then(data => {
                system_arch_setter(data.system_arch)
                system_public_ip_setter(data.system_public_ip)
                system_cpu_name_setter(data.system_cpu_name)
                system_linux_version_setter(data.system_linux_version)
                system_run_time_setter(data.system_run_time)
            })
    })

    return (
        <>
            <Card id="SystemInfo" className="card" title="系统信息">
                <Card.Meta
                    description={
                        <Descriptions
                            size="small"
                            column={1}
                        >
                            <Descriptions.Item label="公网 IP">{system_public_ip}</Descriptions.Item>
                            <Descriptions.Item label="系统架构">{system_arch}</Descriptions.Item>
                            <Descriptions.Item label="处理器名">{system_cpu_name}</Descriptions.Item>
                            <Descriptions.Item label="内核版本">{system_linux_version}</Descriptions.Item>
                            <Descriptions.Item label="运行时间">{system_run_time}</Descriptions.Item>
                        </Descriptions>
                    }
                />
            </Card>
        </>
    )
}
import {Flex, Card} from "antd"
import Chart from "./Chart"
import {useContext, useEffect, useState} from "react";
import {ConfigContext} from "../../config.tsx";

export type SystemStatus = {
    disk_usage: number,
    average_load: number,
    memory_usage: number,
    cpu_usage: number,

    load1m: number,
    load5m: number,
    load15m: number,

    cpu_number: number,
    cpu_cores: number,
    cpu_mhz: number,
    cpu_arch: number,

    ram_total: number,
    ram_used_free: number[],
    ram_mhz: number,
    ram_swap: number,

    disk_total: number,
    disks: Disk[],
}

export type Disk = {
    FileSystem: number,
    MaxMemory: number,
    UsedMemory: number,
    MountedPath: number,
}

// Plugin 表单插件 显示系统状态
export default function Plugin() {
    const config = useContext(ConfigContext);
    const API = `${config?.API_URL}/api/v1/status/system_status`;
    const UPDATE_INTERVAL = 2000;
    const [systemStatus, setSystemStatus] = useState<SystemStatus>({
        disk_usage: 0,
        average_load: 0,
        memory_usage: 0,
        cpu_usage: 0,

        load1m: 0,
        load5m: 0,
        load15m: 0,

        cpu_number: 0,
        cpu_cores: 0,
        cpu_mhz: 0,
        cpu_arch: 0,

        ram_total: 0,
        ram_used_free: [0, 0],
        ram_mhz: 0,
        ram_swap: 0,

        disk_total: 0,
        disks: [],
    })

    const update = async () => {
        const response = await fetch(API);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            setSystemStatus(data);
        }
    }

    useEffect(() => {
        const timer = setInterval(update, UPDATE_INTERVAL);

        // 清理函数
        return () => {
            clearInterval(timer);
        };
    }, [API]);

    useEffect(() => {
        update()
    }, [])

    return (
        <>
            {/* 四个仪表盘 */}
            <Card id="Charts" className="card" title="性能监控">
                <Flex justify="space-evenly" align="center">
                    <Chart title="Load" status={systemStatus}/>
                    <Chart title="CPU" status={systemStatus}/>
                    <Chart title="RAM" status={systemStatus}/>
                    <Chart title="Disk" status={systemStatus}/>
                </Flex>
            </Card>
        </>
    )
}
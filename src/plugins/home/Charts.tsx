import {Flex, Card} from "antd"
import Chart from "./Chart"
import {useContext, useEffect, useState} from "react";
import {ConfigContext} from "../../config.tsx";


// Plugin 表单插件 显示系统状态
export default function Plugin() {
    const config = useContext(ConfigContext);
    const API = config?.API_URL + "/api/v1/status/system_status"
    const [average_load, average_load_setter] = useState(0)
    const [cpu_usage, cpu_usage_setter] = useState(0)
    const [disk_usage, disk_usage_setter] = useState(0)
    const [memory_usage, memory_usage_setter] = useState(0)

    useEffect(() => {
        function update() {
            fetch(API)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    const average_load = Math.floor(data.average_load)
                    const cpu_usage = Math.floor(data.cpu_usage * 100) / 100
                    const disk_usage = Math.floor(data.disk_usage * 100) / 100
                    const memory_usage = Math.floor(data.memory_usage * 100) / 100

                    average_load_setter(average_load)
                    cpu_usage_setter(cpu_usage)
                    disk_usage_setter(disk_usage)
                    memory_usage_setter(memory_usage)
                })
        }

        update();
        const timer = setInterval(update, 2000);

        // 清理函数
        return () => {
            clearInterval(timer);
        };
    }, [API]);

    return (
        <>
            {/* 四个仪表盘 */}
            <Card id="Charts" className="card" title="性能监控">
                <Flex justify="space-evenly" align="center">
                    <Chart title="Load" percent={average_load}/>
                    <Chart title="CPU" percent={cpu_usage}/>
                    <Chart title="RAM" percent={memory_usage}/>
                    <Chart title="Disk" percent={disk_usage}/>
                </Flex>
            </Card>
        </>
    )
}
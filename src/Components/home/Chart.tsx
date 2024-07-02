import {Descriptions, Progress} from "antd";
import {SystemStatus} from "./Charts.tsx"

const memoryUnits = ["B", "KB", "MB", "GB"];

// 转换内存单位
function ChangeMemory(n: number, showUnit: boolean = true) {
    let unitIndex = 0;
    while (n >= 1024 && unitIndex < memoryUnits.length - 1) {
        n /= 1024;
        unitIndex++;
    }
    return n.toFixed(2) + (showUnit ? memoryUnits[unitIndex] : "");
}

function LoadItems(status: SystemStatus) {
    return <>
        <Descriptions.Item label="平均负载">{status.average_load.toFixed(2)}%</Descriptions.Item>
        <Descriptions.Item label="最近1分钟">{status.load1m}%</Descriptions.Item>
        <Descriptions.Item label="最近5分钟">{status.load5m}%</Descriptions.Item>
        <Descriptions.Item label="最近15分钟">{status.load15m}%</Descriptions.Item>
    </>;
}

function CPUItems(status: SystemStatus) {
    return <>
        <Descriptions.Item label="工作负载">{status.cpu_usage.toFixed(2)}%</Descriptions.Item>
        <Descriptions.Item label="核心数量">{status.cpu_number} * {status.cpu_cores} Core</Descriptions.Item>
        <Descriptions.Item label="核心频率">{status.cpu_mhz} MHz</Descriptions.Item>
        <Descriptions.Item label="核心架构">{status.cpu_arch}</Descriptions.Item>
    </>;
}

function RAMItems(status: SystemStatus) {
    return <>
        <Descriptions.Item label="内存占用">{status.memory_usage.toFixed(2)}%</Descriptions.Item>
        <Descriptions.Item label="内存容量">{ChangeMemory(status.ram_total)}</Descriptions.Item>
        <Descriptions.Item label="内存频率">{status.ram_mhz} MHz</Descriptions.Item>
        <Descriptions.Item label="交换内存">{ChangeMemory(status.ram_swap)}</Descriptions.Item>
    </>;
}

function DiskItems(status: SystemStatus) {
    // 只显示前两个磁盘
    status.disks = status.disks.slice(0, 2);
    return <>
        <Descriptions.Item label="磁盘占用">{status.disk_usage.toFixed(2)}%</Descriptions.Item>
        <Descriptions.Item label="磁盘容量">{ChangeMemory(status.disk_total)}</Descriptions.Item>
        {status.disks.map((disk, index) => {
            return <Descriptions.Item key={index}
                                      label={disk.FileSystem}>{ChangeMemory(disk.UsedMemory, false)} / {ChangeMemory(disk.MaxMemory)}</Descriptions.Item>
        })}
    </>;
}

export default function Plugin({title, status}: { title: string, status: SystemStatus }) {
    let percent = 0;
    let items = <></>;

    switch (title) {
        case "Load":
            percent = status.average_load;
            items = LoadItems(status);
            break;
        case "CPU":
            percent = Math.floor(status.cpu_usage * 100) / 100;
            items = CPUItems(status);
            break;
        case "RAM":
            percent = Math.floor(status.memory_usage * 100) / 100;
            items = RAMItems(status);
            break;
        case "Disk":
            percent = Math.floor(status.disk_usage * 100) / 100;
            items = DiskItems(status);
            break;
    }

    return (
        <>
            <div id="Chart">
                <span>{title}</span>
                <Progress type="dashboard" percent={percent} strokeColor="#ff8383"/>
                <Descriptions
                    size="small"
                    column={1}
                    className={"ChartDescriptions"}
                >
                    {items}
                </Descriptions>
            </div>
        </>
    )
}
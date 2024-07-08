import { useState, useEffect } from "react";
import { config } from "../config";
import { ProCard } from "@ant-design/pro-components";
import { Slider } from "antd";
import ReactEcharts from 'echarts-for-react';

function getColorByIndex(index: number): string {
    const colors = ['#FF7F7F'];
    return colors[index % colors.length];
}

export default function Status() {
    const [cpuData, setCpuData] = useState<{ type: string; value: any; time: any }[]>([]);
    const [diskData, setDiskData] = useState<{ type: string; value: any; time: any }[]>([]);
    const [loadData, setLoadData] = useState<{ type: string; value: any; time: any }[]>([]);
    const [networkData, setNetworkData] = useState<{ type: string; value: any; time: any }[]>([]);
    const [networkPkgData, setNetworkPkgData] = useState<{ type: string; value: any; time: any }[]>([]);
    const [ramData, setRamData] = useState<{ type: string; value: any; time: any }[]>([]);
    const [displayRange, setDisplayRange] = useState<number>(100);

    useEffect(() => {
        let api
        if (config.WS_URL) {
            api = config.WS_URL + "/api/ws/status"
        } else {
            api = "ws://" + window.location.host + "/api/ws/status";
        }

        const ws = new WebSocket(api);
        ws.onopen = () => {
            console.log("连接成功");
        };
        ws.onmessage = (e: MessageEvent) => {
            let strData = e.data;
            let parsedDatas = JSON.parse(strData);
            let tempCpuData: any[] = [];
            let tempDiskData: any[] = [];
            let tempLoadData: any[] = [];
            let tempNetworkData: any[] = [];
            let tempNetworkPkgData: any[] = [];
            let tempRamData: any[] = [];
            for (let i = 0; i < parsedDatas.length; i++) {
                const parsedData = parsedDatas[i];
                tempCpuData.push({ type: 'CPU', value: parsedData.cpu, time: parsedData.time });
                tempDiskData.push(
                    { type: '磁盘写入IO', value: parsedData.disk_io[0], time: parsedData.time },
                    { type: '磁盘读取IO', value: parsedData.disk_io[1], time: parsedData.time }
                );
                tempLoadData.push(
                    { type: '负载(五分钟)', value: parsedData.load_average[0], time: parsedData.time },
                    { type: '负载(十分钟)', value: parsedData.load_average[1], time: parsedData.time },
                    { type: '负载(十五分钟)', value: parsedData.load_average[2], time: parsedData.time }
                );
                tempNetworkData.push(
                    { type: '网络接收字节', value: parsedData.network_io[0], time: parsedData.time },
                    { type: '网络发送字节', value: parsedData.network_io[1], time: parsedData.time }
                );
                tempNetworkPkgData.push(
                    { type: '网络接收包', value: parsedData.network_io[2], time: parsedData.time },
                    { type: '网络发送包', value: parsedData.network_io[3], time: parsedData.time }
                );
                tempRamData.push(
                    { type: '空闲内存', value: parsedData.ram[0], time: parsedData.time },
                    { type: '使用内存', value: parsedData.ram[1], time: parsedData.time }
                );
            }
            setCpuData(prevData => [...prevData, ...tempCpuData]);
            setDiskData(prevData => [...prevData, ...tempDiskData]);
            setLoadData(prevData => [...prevData, ...tempLoadData]);
            setNetworkData(prevData => [...prevData, ...tempNetworkData]);
            setNetworkPkgData(prevData => [...prevData, ...tempNetworkPkgData]);
            setRamData(prevData => [...prevData, ...tempRamData]);
        };
    }, []);

    const createChartConfig = (data: any) => ({
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: Array.from(new Set(data.map((item: any) => item.type))),
        },
        xAxis: {
            type: 'category',
            data: data.slice(-displayRange).map((item: any) => (
                // timeStep 转为时间
                new Date(item.time * 1000).toLocaleString()
            )),
        },
        yAxis: {
            type: 'value',
        },
        series: Array.from(new Set(data.map((item: any) => item.type)) as Set<string>).map((type: string, index: number) => ({
            name: type,
            type: 'line',
            showSymbol: false,
            smooth: true,
            itemStyle: {
                color: getColorByIndex(index), // 定义折线的颜色
            },
            emphasis: {
                focus: 'series',
                itemStyle: {
                    opacity: 1,
                },
            },
            data: data.filter((item: any) => item.type === type).slice(-displayRange).map((item: any) => item.value),
        })),
    });

    return (
        <ProCard>
            <h1>状态</h1>
            <Slider
                min={10}
                max={cpuData.length}
                defaultValue={10}
                onChange={(value) => setDisplayRange(value)}
                style={{
                    marginBottom: 20,
                }}
            />
            <ReactEcharts option={createChartConfig(cpuData)} />
            <ReactEcharts option={createChartConfig(diskData)} />
            <ReactEcharts option={createChartConfig(loadData)} />
            <ReactEcharts option={createChartConfig(networkData)} />
            <ReactEcharts option={createChartConfig(networkPkgData)} />
            <ReactEcharts option={createChartConfig(ramData)} />
        </ProCard>
    );
}

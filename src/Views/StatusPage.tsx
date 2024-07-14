import { useState, useEffect } from "react";
import { config } from "../config";
import { ProCard } from "@ant-design/pro-components";
import { Slider, InputNumber, Select, Card, Col, Form, Row, Button, message, Input } from "antd";
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
        <Card>
            <ProCard title="持久化状态">
                <Slider
                    min={10}
                    max={cpuData.length}
                    defaultValue={10}
                    onChange={(value) => setDisplayRange(value)}
                    style={{
                        marginBottom: 20,
                    }}
                />
                <Card title="设置状态持久化记录时间">
                    <Form onFinish={(values) => {
                        if (values.saveTimeValue === undefined) {
                            values.saveTimeValue = 5
                        }
                        if (values.stepTimeValue === undefined) {
                            values.stepTimeValue = 5
                        }
                        console.log(values)

                        fetch(config.API_URL + "/api/v1/status/config", {
                            method: "POST",
                            body: JSON.stringify(values),
                            headers: {
                                "Content-Type": "application/json",
                            },
                            credentials: "include",
                        }).then(res => {
                            return res.json()
                        }).then((res: { status: number, msg: string }) => {
                            if (res.status != 0) {
                                message.error(res.msg);
                            } else {
                                message.success(res.msg);
                            }
                        })
                    }}>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item label="设置状态记录间隔时间:" style={{ marginBottom: 16 }}>
                                    <Input.Group compact>
                                        <Form.Item name="stepTimeValue" noStyle>
                                            <InputNumber min={1} defaultValue={5} style={{ width: '70%' }} />
                                        </Form.Item>
                                        <Form.Item name="stepTimeUnit" initialValue="second" noStyle>
                                            <Select style={{ width: '30%' }}>
                                                <Select.Option value="second">秒</Select.Option>
                                                <Select.Option value="minute">分钟</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Input.Group>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="设置状态最长保存时间:" style={{ marginBottom: 16 }}>
                                    <Input.Group compact>
                                        <Form.Item name="saveTimeValue" noStyle>
                                            <InputNumber min={1} defaultValue={5} style={{ width: '70%' }} />
                                        </Form.Item>
                                        <Form.Item name="saveTimeUnit" initialValue="minute" noStyle>
                                            <Select style={{ width: '30%' }}>
                                                <Select.Option value="second">秒</Select.Option>
                                                <Select.Option value="minute">分钟</Select.Option>
                                                <Select.Option value="hour">小时</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Input.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">提交</Button>
                        </Form.Item>
                    </Form>
                </Card>
                <Card style={{ marginTop: '10px' }}>
                    <Card title="CPU占用"><ReactEcharts option={createChartConfig(cpuData)} /></Card>
                    <Card title="磁盘IO"><ReactEcharts option={createChartConfig(diskData)} /></Card>
                    <Card title="平均负载"><ReactEcharts option={createChartConfig(loadData)} /></Card>
                    <Card title="网络IO"><ReactEcharts option={createChartConfig(networkData)} /></Card>
                    <Card title="网络包"><ReactEcharts option={createChartConfig(networkPkgData)} /></Card>
                    <Card title="内存占用"><ReactEcharts option={createChartConfig(ramData)} /></Card>
                </Card>
            </ProCard>
        </Card>
    );
}
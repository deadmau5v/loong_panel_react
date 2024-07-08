import { useState } from "react";
import { Descriptions, message, Button, Layout, Col, Row, Select, Table } from "antd";
import { config } from "../config";
const { Content } = Layout;
import { ScanOutlined, DashboardOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";

type ScanReport = {
    data_read: string;
    data_scanned: string;
    end_date: string;
    engine_version: string;
    infected_files: number;
    known_viruses: number;
    scanned_directories: number;
    scanned_files: number;
    start_date: string;
    time: string;
}

export default function Page() {
    const [scanReport, setScanReport] = useState<ScanReport>();
    const [scanning, setScanning] = useState(false);
    const [scanLog, setScanLog] = useState<string[]>([]);

    const handleScanStart = (type: string, path: string, ws: boolean) => {
        setScanLog([]);
        setScanning(true);
        let api = config.API_URL + "/api/v1/clamav/scan?path=" + encodeURIComponent(path) + "&type=" + type;
        if (ws) {
            if (config.WS_URL) {
                api = config.WS_URL + "/api/ws/clamav/scan?type=" + type + "&path=" + encodeURIComponent(path);
            } else {
                api = "ws://" + window.location.host + "/api/ws/clamav/scan?type=" + type + "&path=" + encodeURIComponent(path);
            }
        }
        if (ws) {
            try {
                const ws = new WebSocket(api);
                ws.onmessage = (event) => {
                    let strData = event.data.toString();
                    // 如果是json 就解析出来
                    try {
                        const jsonData = JSON.parse(strData);
                        if (jsonData.status === 0 && jsonData.data) {
                            setScanReport(jsonData.data);
                            setScanLog(prevLogs => [...prevLogs, "扫描完成: OK"]);
                        } else {
                            setScanLog(prevLogs => [...prevLogs, "信息: " + jsonData.msg]);
                        }
                    } catch (e) {
                        strData = strData.trim();
                        strData = strData.replace(" ", "").replace("\t", "")

                        // 否则就是过程日志
                        if (strData.includes("\n")) {
                            const newLogs = strData.split("\n");
                            setScanLog(prevLogs => [...prevLogs, ...newLogs]);
                        } else {
                            setScanLog(prevLogs => [...prevLogs, strData]);
                        }
                    }


                };
            } catch (error) {
                setScanning(false)
                message.error("WebSocket 连接失败");
            }
        } else {
            fetch(api, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "GET",
                credentials: "include",
            }).then((res) => {
                return res.json();
            }).then((data) => {
                message.destroy();
                if (data.status !== 0) {
                    message.error(data.msg);
                } else {
                    setScanReport(data.data);
                }
                setScanning(false);
            });
        }
    };

    return (
        <ProCard>
            <Row>
                <ProCard>
                    <Col>
                        <Row gutter={16} style={{ margin: 20 }}>
                            <Col span={12}>
                                <Button type="primary" size="large" block onClick={() => handleScanStart("full", "/", true)} icon={<ScanOutlined />}>
                                    全盘扫描
                                </Button>
                            </Col>
                            <Col span={12}>
                                <Button type="default" size="large" block onClick={() => handleScanStart("fast", "/", true)} icon={<DashboardOutlined />}>
                                    快速扫描
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                                <div>
                                    <Select defaultValue="none" style={{ width: 300, marginBottom: 10 }} onChange={(value) => console.log(value)}>
                                        <Select.Option value="none">不设置定时</Select.Option>
                                        <Select.Option value="daily">每天</Select.Option>
                                        <Select.Option value="weekly">每周</Select.Option>
                                        <Select.Option value="monthly">每月</Select.Option>
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </ProCard>

                <Col style={{ width: "100%" }}>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,

                            }}
                        >
                            {
                                scanning ? (
                                    <>
                                        <Table dataSource={scanLog.slice(scanLog.length - 20, scanLog.length).map((log, index) => ({ key: index, file: log.split(":")[0], result: log.split(":")[1] || "无结果" }))} pagination={false}>
                                            <Table.Column title="文件" dataIndex="file" key="file" render={(text) => (
                                                <span>{text && text.trim().length > 100 ? text.slice(0, 20) + "..." : text}</span>
                                            )} />
                                            <Table.Column title="检测结果" dataIndex="result" key="result" render={(text) => (
                                                <span>{text.trim()}</span>
                                            )} />
                                        </Table>
                                    </>

                                ) : scanReport ? (
                                    <Descriptions title="扫描结果">
                                        <Descriptions.Item label="已知病毒">{scanReport.known_viruses}</Descriptions.Item>
                                        <Descriptions.Item label="引擎版本">{scanReport.engine_version}</Descriptions.Item>
                                        <Descriptions.Item label="扫描目录">{scanReport.scanned_directories}</Descriptions.Item>
                                        <Descriptions.Item label="扫描文件">{scanReport.scanned_files}</Descriptions.Item>
                                        <Descriptions.Item label="感染文件">{scanReport.infected_files}</Descriptions.Item>
                                        <Descriptions.Item label="数据扫描">{scanReport.data_scanned}</Descriptions.Item>
                                        <Descriptions.Item label="数据读取">{scanReport.data_read}</Descriptions.Item>
                                        <Descriptions.Item label="扫描时间">{scanReport.time}</Descriptions.Item>
                                        <Descriptions.Item label="开始时间">{scanReport.start_date}</Descriptions.Item>
                                        <Descriptions.Item label="结束时间">{scanReport.end_date}</Descriptions.Item>
                                    </Descriptions>
                                ) : (
                                    <p>正在扫描或选择扫描类型</p>
                                )}
                        </Content>
                    </Layout>
                </Col>
            </Row>
        </ProCard>
    );
}
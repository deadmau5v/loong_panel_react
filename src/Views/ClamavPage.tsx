import { useState } from "react";
import { Descriptions, message, Button, Layout, Col, Row } from "antd";
import { config } from "../config";
const { Content } = Layout;

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
            console.log(api);
            try {
                const ws = new WebSocket(api);
                ws.onmessage = (event) => {
                    let strData = event.data.toString();
                    strData = strData.trim();
                    strData = strData.replace(" ","").replace("\t", "")
                    if (strData.includes("\n")) {
                        const newLogs = strData.split("\n");
                        setScanLog(prevLogs => [...prevLogs, ...newLogs]);
                    } else {
                        setScanLog(prevLogs => [...prevLogs, strData]);
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
        <>
            <Row>
                <Col>
                    <Row><Button onClick={() => handleScanStart("full", "/", true)}>全盘扫描</Button></Row>
                    <Row><Button onClick={() => handleScanStart("fast", "/", true)}>快速扫描</Button></Row>
                </Col>
                <Col>
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
                                        <ul style={{ height: '200px'}}>
                                            {scanLog.slice(scanLog.length - 20, scanLog.length).map((log, index) => (
                                                <li key={index}>
                                                        <span style={{ color: "green" }}>检测结果:</span> OK
                                                        <span style={{paddingLeft: '10px', color: "green"}}>文件:</span> {log.split(":")[0].length > 100? log.split(":")[0].slice(0, 20) + "..." : log.split(":")[0]}
                                                </li>
                                            ))}
                                        </ul>
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
        </>
    );
}
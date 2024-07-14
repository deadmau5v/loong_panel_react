import { ProCard } from "@ant-design/pro-components"
import { config } from "../config"
import { useState } from "react"
import { Button, Card } from 'antd';
import scan from "../assets/scan.png"

interface Message {
    message: string;
    status: string;
}

export default function Page() {
    const [messages, setMessages] = useState<Message[]>([])
    const [scanning, setScanning] = useState(false)

    const inspection = () => {
        setScanning(true)
        setMessages([])
        const api = config.WS_URL ? config.WS_URL + "/api/ws/check" : `ws://${window.location.host}/api/ws/check`
        const ws = new WebSocket(api)
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data) as Message
            setMessages(prevMessages => [...prevMessages, data])
        }
        ws.onclose = () => {
            setScanning(false)
        }
    }

    return (
        <ProCard>
            <Card style={{ width: '40%' }}>
                <Button onClick={inspection} disabled={scanning}>
                    一键巡检
                </Button>
                {scanning && (
                    <div style={{ position: 'relative', width: '40px', height: '40px', margin: '16px auto' }}>
                        <img src={scan} alt="扫描中" style={{
                            position: 'absolute',
                            width: '40px',
                            height: '40px',
                            animation: 'scanAnimation 2s infinite'
                        }} />
                    </div>
                )}
                <style>
                    {`
                        @keyframes scanAnimation {
                            0% { transform: translate(0, 0) rotate(0deg); }
                            25% { transform: translate(20px, 0) rotate(90deg); }
                            50% { transform: translate(20px, 20px) rotate(180deg); }
                            75% { transform: translate(0, 20px) rotate(270deg); }
                            100% { transform: translate(0, 0) rotate(360deg); }
                        }
                    `}
                </style>
                <div style={{ marginTop: '16px' }}>
                    <h3>巡检功能介绍</h3>
                    <p>本系统可以检查以下项目：磁盘容量、CPU状态、内存状态、网络访问、系统运行时间、时间同步、SSH服务状态、SSH Root登录、SSH密码登录、SSH端口、SSH协议版本、SSH最大认证尝试次数、SSH登录宽限时间、防火墙状态、防火墙规则。</p>
                    <p>点击“一键巡检”按钮后，系统会依次检查各项内容，并将检查结果实时显示在页面上。检查结果分为三种状态：</p>
                    <ul>
                        <li><span style={{ color: 'green', fontWeight: 'bold' }}>正常</span>：表示该项检查通过，服务器状态正常。</li>
                        <li><span style={{ color: 'orange', fontWeight: 'bold' }}>警告</span>：表示该项检查存在潜在隐患，建议修复。</li>
                        <li><span style={{ color: 'red', fontWeight: 'bold' }}>异常</span>：表示服务器存在严重问题，需要立即处理。</li>
                    </ul>
                </div>
            </Card>
            <ProCard>
                <ProCard bordered style={{ marginBottom: 16 }}>
                    <ProCard title="巡检项">
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {messages.map((msg, index) => {
                                if (msg.status === "msg") {
                                    return index === messages.length - 1 ? (
                                        <div key={index} style={{ margin: '16px', padding: '16px', border: '1px solid #f0f0f0', borderRadius: '4px', width: 'calc(100% / 3 - 32px)', boxSizing: 'border-box', fontSize: '16px' }}>
                                            <div style={{ fontWeight: 'bold' }}>检查中...</div>
                                            <div>{msg.message}</div>
                                        </div>
                                    ) : null;
                                } else {
                                    return (
                                        <div key={index} style={{ margin: '16px', padding: '16px', border: '1px solid #f0f0f0', borderRadius: '4px', width: 'calc(100% / 3 - 32px)', boxSizing: 'border-box', fontSize: '16px' }}>
                                            <div style={{ fontWeight: 'bold', color: msg.status === "OK" ? "green" : msg.status === "ERROR" ? "red" : msg.status === "WARN" ? "orange" : "" }} >
                                                <span style={{ color: msg.status === "OK" ? "green" : msg.status === "ERROR" ? "red" : msg.status === "WARN" ? "orange" : "", marginRight: '8px' }}>●</span>
                                                {msg.status === "OK" ? "正常" : msg.status === "ERROR" ? "异常" : msg.status === "WARN" ? "警告" : ""}
                                            </div>
                                            <div>{msg.message}</div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </ProCard>
                </ProCard>
            </ProCard>
        </ProCard>
    )
}
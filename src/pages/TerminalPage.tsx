import {Terminal} from "@xterm/xterm"
import {useContext, useEffect, useState} from "react";
import {ConfigContext} from "../config.tsx";
import {ProCard} from "@ant-design/pro-components";
import {Button, Divider} from "antd";
import {useAuth} from "../plugins/AuthContext.tsx";
import {FitAddon} from 'xterm-addon-fit';

type screen = {
    name: string,
    id: number
}

export default function Page() {
    const config = useContext(ConfigContext);
    const [screen, setScreen] = useState([])
    const [term,] = useState(() => new Terminal());

    // 验证是否登录
    const [webSocket, setWebSocket] = useState<WebSocket | undefined>();
    const {logined} = useAuth()
    if (!logined) {
        window.location.href = "/login"
    }
    const fitAddon = new FitAddon()

    useEffect(() => {
        const terminalDiv = document.getElementById('terminal');

        window.addEventListener('resize', () => {
            fitAddon.fit();
        });

        if (terminalDiv) {
            term.loadAddon(fitAddon)
            term.open(terminalDiv);
            fitAddon.fit()

            term.clear();
            term.writeln("欢迎使用 LoongPanel 终端 ...")
        }
        getScreen()
    }, [])
    let getWsUrl: (id: number) => string;
    const getApiUrl = (endpoint: string) => `${config?.API_URL}/api/v1/${endpoint}`;
    if (config?.WS_URL != "") {
        getWsUrl = (id: number) => `${config?.WS_URL}/api/ws/screen?id=${id}`;
    } else {
        getWsUrl = (id: number) => `ws://${window.location.host}/api/ws/screen?id=${id}`;
    }

    const getScreen = async () => {
        const response = await fetch(getApiUrl("screen/screen"), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("SESSION") || ""
            }
        });
        if (response.ok) {
            const data = await response.json();
            setScreen(data);
        }
    };

    const createScreen = async () => {
        const response = await fetch(getApiUrl("screen/screen"), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("SESSION") || ""
            }
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            await getScreen();
        }
    }

    const initializeWebSocket = (id: number) => {
        const ws = new WebSocket(getWsUrl(id));
        ws.onmessage = event => term.write(event.data);
        term.onData(data => ws.send(data));
        setWebSocket(ws);
    }

    const changeScreen = (id: number) => {
        webSocket?.close();
        term.clear();
        term.writeln("🔄   正在连接到窗口 ...");
        term.clear();
        term.writeln(`\n🔄   正在连接到窗口 [${id}] ...`);
        initializeWebSocket(id);
        term.writeln("✅   链接成功.");
        fitAddon.fit()
        term.clear();
    }

    return (
        <>
            <ProCard gutter={20}>
                <ProCard id="TerminalCard" direction="column">
                    <link rel="stylesheet" href="https://cdn1.d5v.cc/CDN/Project/LoongPanel/static/xterm.css"/>
                    <div id="terminal" style={{
                        height: "100%",
                        width: "100%",
                    }}/>
                </ProCard>
                <ProCard direction="column" id="buttons" style={{maxWidth: "20%"}}>
                    <Button type="primary" onClick={createScreen} id="createScreen">创建窗口</Button>
                    <Divider/>
                    {
                        screen.map((item: screen) => (
                            <Button key={item.id} onClick={() => changeScreen(item.id)}>{item.name}</Button>
                        ))
                    }
                </ProCard>
            </ProCard>
        </>
    )
}
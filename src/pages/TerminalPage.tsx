import {Terminal} from "@xterm/xterm"
import {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {ConfigContext} from "../config.tsx";
import {ProCard} from "@ant-design/pro-components";
import {Button, Divider} from "antd";


type screen = {
    name: string,
    id: number
}

export default function Page() {
    console.log("初始化Page Terminal")
    const config = useContext(ConfigContext);
    const [screen, setScreen] = useState([])
    const [term,] = useState(() => new Terminal());
    const [webSocket, setWebSocket]
        : [WebSocket | undefined, Dispatch<SetStateAction<WebSocket | undefined>>]
        = useState();

    term.resize(140, 45);

    useEffect(() => {
        // 设置终端行数
        const terminalDiv = document.getElementById('terminal');

        if (terminalDiv) {
            console.log("初始化终端")
            term.open(terminalDiv);
            term.clear();
            term.writeln("欢迎使用 LoongPanel 终端")
        }
        getScreen()
    }, [])

    const API_get_screens = config?.API_URL + "/api/v1/screen/get_screens"
    const API_create_screens = config?.API_URL + "/api/v1/screen/create"
    const API_screen_ws = "ws://127.0.0.1:8080/api/ws/screen"
    const getScreen = function getScreen() {
        fetch(API_get_screens, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
        }).then(data => {
                if (data) {
                    setScreen(data);
                }
            }
        );
    };

    function createScreen() {
        fetch(API_create_screens, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
        }).then(data => {
                if (data) {
                    console.log(data)
                    getScreen();
                }
            }
        );
    }

    function ChangeScreen(id: number) {
        term.clear()
        webSocket?.close()
        const ws = new WebSocket(API_screen_ws + "/?id=" + id)
        ws.onmessage = function (event) {
            term.write(event.data)
        }
        term.onData(data => {
            ws.send(data)
        })
        setWebSocket(ws)
    }

    return (
        <>
            <ProCard gutter={16}>
                <ProCard id="TerminalCard" direction="column">
                    <link rel="stylesheet" href="https://cdn1.d5v.cc/CDN/Project/LoongPanel/static/xterm.css"/>
                    <div id="terminal"/>
                </ProCard>
                <ProCard direction="column" id={"buttons"}>
                    <Button type={"primary"} onClick={createScreen} id={"createScreen"}>创建窗口</Button>
                    <Divider/>
                    {
                        screen.map((item: screen) => {
                                return (
                                    <Button key={item.id} onClick={() => {
                                        ChangeScreen(item.id)
                                    }}>{item.name}</Button>
                                )
                            }
                        )
                    }
                </ProCard>
            </ProCard>
        </>
    )
}
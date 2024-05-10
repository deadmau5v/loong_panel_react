import {Terminal} from "@xterm/xterm"
import {useCallback, useContext, useEffect, useState} from "react";
import {ConfigContext} from "../config.tsx";
import {ProCard} from "@ant-design/pro-components";
import {Button, Divider} from "antd";
import "./terminal.less"

export default function Page() {
    const config = useContext(ConfigContext);

    const [screen, setScreen] = useState([])
    const [term,] = useState(new Terminal());
    term.resize(140, 45);

    useEffect(() => {
        // 设置终端行数
        const terminalDiv = document.getElementById('terminal');
        if (terminalDiv) {
            term.open(terminalDiv);
            term.clear();
        }
    }, [term])

    const API_get_screens = config?.API_URL + "/api/v1/screen/get_screens"
    const API_create_screens = config?.API_URL + "/api/v1/screen/create"

    const getScreen = useCallback(function getScreen() {
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
    }, [API_get_screens]);

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
                        screen.map((item, index) => {
                                return (
                                    <Button key={index} onClick={() => {
                                        console.log(item)
                                    }}>{item}</Button>
                                )
                            }
                        )
                    }
                </ProCard>
            </ProCard>
        </>
    )
}
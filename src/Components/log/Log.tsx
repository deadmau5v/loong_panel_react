import {useEffect, useState} from "react";
import {config} from "../../config.tsx";
import {ProTable} from "@ant-design/pro-components";
import {Button} from "antd";

export default function Log({name}: { name: string }) {
    const [columns, setColumns] = useState([]);
    const [content, setContent] = useState([]);

    function GetLog() {
        const OptionAPI = config.API_URL + "/api/v1/log/options?name=" + name
        fetch(OptionAPI, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
        }).then(res => res.json()).then(data => {
            if (data.status == 0) {
                setColumns(data.data[0])
            }
        })

        const API = config.API_URL + "/api/v1/log/log?name=" + name + "&line=100"
        fetch(API, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
        }).then(res => res.json()).then(data => {
            setContent(data.data)
        })
    }

    useEffect(() => {
        // 获取日志
        GetLog()
    }, [])


    const clearLogs = async () => {
        const API = config?.API_URL + "/api/v1/log/log?name=" + name
        await fetch(API, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
        });
        GetLog();
    }

    return <>
        <Button onClick={clearLogs}>清理日志</Button>
        <Button onClick={GetLog}>更新获取</Button>
        <ProTable
        columns={columns}
        dataSource={content}
        toolbar={{style: {height: 0}}}
        search={false}
        />
    </>
}
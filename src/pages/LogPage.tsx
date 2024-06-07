import {ConfigContext} from "../config.tsx";
import {useContext, useEffect, useState} from "react";
import {ProCard} from "@ant-design/pro-components";
import {Tabs} from "antd";

export default function Page() {
    const config = useContext(ConfigContext);
    const [logs, setLogs] = useState<string[]>([]);


    const GetLogs = async () => {
        const API = config?.API_URL + "/api/v1/log/logs"
        type response = {
            status: number,
            data: string[]
        }
        const res = await fetch(API, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("SESSION") || ""
            }
        });
        const data: response = await res.json();
        if (data.status === 0) {
            setLogs(data.data);
        }
    }

    useEffect(() => {
        GetLogs();
    }, []);

    const items = logs.map((log, index) => {
        return {
            label: log,
            key: index.toString()
        }
    })

    return (
        <>
            <ProCard>
                <Tabs
                items={items}/>
            </ProCard>
        </>
    );
}
import Charts from "../plugins/home/Charts.tsx"
import SystemInfo from "../plugins/home/SystemInfo.tsx"
import Power from "../plugins/home/Power.tsx"
import {ProCard} from "@ant-design/pro-components";
import "./home.less";
import {ReactElement, useEffect, useState} from "react";

export default function Page() {
    const pageName = "home"
    let content: ReactElement
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (width > 1200) {
        content = <>
            {/* 左右 布局 */}
            <ProCard id="main" bordered gutter={16}>
                {/* 左边 60% */}
                <ProCard direction="column" id="main-l">
                    <Charts/>
                </ProCard>
                {/*  右边 40% */}
                <ProCard direction="column" id="main-r" colSpan={{
                    xs: '30%',
                    sm: '30%',
                    md: '30%',
                    lg: '30%',
                    xl: '30%',
                }}>
                    <SystemInfo/>
                    <Power/>
                </ProCard>
            </ProCard>
        </>
    } else {
        content = <>
            {/* 窄布局 */}
            <ProCard id="main" bordered direction="column" className="main-l main-r">
                <Charts/>
                <SystemInfo/>
                <Power/>
            </ProCard>
        </>
    }

    console.log(pageName)
    return (
        <>
            {content}
        </>
    )
}
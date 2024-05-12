import Charts from "../plugins/home/Charts.tsx"
import SystemInfo from "../plugins/home/SystemInfo.tsx"
import Power from "../plugins/home/Power.tsx"
import {ProCard} from "@ant-design/pro-components";
import {ReactElement} from "react";

export default function Page() {
    const pageName = "home"
    let content: ReactElement

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

    console.log(pageName)
    return (
        <>
            {content}
        </>
    )
}
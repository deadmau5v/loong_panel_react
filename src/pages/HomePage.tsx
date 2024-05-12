import {ProCard} from "@ant-design/pro-components";
import {lazy, Suspense} from 'react';

const Charts = lazy(() => import('../plugins/home/Charts.tsx'));
const SystemInfo = lazy(() => import('../plugins/home/SystemInfo.tsx'));
const Power = lazy(() => import('../plugins/home/Power.tsx'));

export default function Page() {
    const pageName = "home"

    const content = <>
        {/* 左右 布局 */}
        <ProCard id="main" bordered gutter={16}>
            {/* 左边 60% */}
            <ProCard direction="column" id="main-l">
                <Suspense fallback={<div>Loading...</div>}>
                    <Charts/>
                </Suspense>
            </ProCard>
            {/*  右边 40% */}
            <ProCard direction="column" id="main-r" colSpan={{
                xs: '30%',
                sm: '30%',
                md: '30%',
                lg: '30%',
                xl: '30%',
            }}>
                <Suspense fallback={<div>Loading...</div>}>
                    <SystemInfo/>
                    <Power/>
                </Suspense>
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
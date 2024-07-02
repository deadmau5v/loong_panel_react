import {ProCard} from "@ant-design/pro-components";
import {lazy, Suspense} from 'react';

const Charts = lazy(() => import('../Components/home/Charts.tsx'));
const SystemInfo = lazy(() => import('../Components/home/SystemInfo.tsx'));
const Power = lazy(() => import('../Components/home/Power.tsx'));

export default function Page() {
    const pageName = "home"

    const content = <>
        {/* 左右 布局 */}
        <ProCard id="main" bordered gutter={16}>
            {/* 左边 60% */}

                <Suspense fallback={<div>Loading...</div>}>
                    <Charts/>
                </Suspense>

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
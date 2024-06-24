import {ProCard} from "@ant-design/pro-components";
import {lazy, Suspense, useEffect} from 'react';
import {useAuth} from "../plugins/AuthContext.tsx";

const Charts = lazy(() => import('../plugins/home/Charts.tsx'));
const SystemInfo = lazy(() => import('../plugins/home/SystemInfo.tsx'));
const Power = lazy(() => import('../plugins/home/Power.tsx'));

export default function Page() {
    const pageName = "home"

    const { logined } = useAuth()
    useEffect(() => {
        if (!logined) {
            window.location.href = "/login";
        }
    }, [logined]);

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
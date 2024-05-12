// src/main.tsx
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
const App = React.lazy(() => import('./App.tsx')); // 使用React.lazy进行代码分割
import './index.less'
import {ConfigContext, config} from "./config.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ConfigContext.Provider value={config}>
            <Suspense fallback={<div>Loading...</div>}> {/* 使用Suspense处理加载状态 */}
                <App/>
            </Suspense>
        </ConfigContext.Provider>
    </React.StrictMode>
)
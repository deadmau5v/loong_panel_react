import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'

// 引入全局样式
import './index.less'
// 引入配置上下文和配置
import {ConfigContext, config} from "./config.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ConfigContext.Provider value={config}>
            <App/>
        </ConfigContext.Provider>
    </React.StrictMode>
)
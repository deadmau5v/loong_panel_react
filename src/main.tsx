import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'

import './index.less'
import {ConfigContext, config} from "./config.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ConfigContext.Provider value={config}>
            <App/>
        </ConfigContext.Provider>
    </React.StrictMode>
)
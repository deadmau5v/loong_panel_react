// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import './index.less'
import {ConfigContext, config} from "./config.tsx";
import {AuthProvider} from './plugins/AuthContext.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ConfigContext.Provider value={config}>
            <AuthProvider>
                    <App/>
            </AuthProvider>
        </ConfigContext.Provider>
    </React.StrictMode>
)
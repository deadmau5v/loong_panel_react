import React from "react";

interface ConfigType {
    API_URL: string;
    WS_URL?: string;
}

export const ConfigContext = React.createContext<ConfigType | null>(null);

export const config: ConfigType = {
    API_URL: 'http://127.0.0.1:8080',
    WS_URL: 'ws://127.0.0.1:8080'
};
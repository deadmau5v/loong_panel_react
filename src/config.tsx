import React from "react";

interface ConfigType {
    API_URL: string;
    WS_URL?: string;
}

export const ConfigContext = React.createContext<ConfigType | null>(null);

export const config: ConfigType = {
    API_URL: '',
    WS_URL: ''
};
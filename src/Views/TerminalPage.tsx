import {useState, useContext, useEffect} from 'react';
import {Button, Modal} from 'antd';
import {ProForm, ProFormText} from '@ant-design/pro-form';
import {ProCard} from '@ant-design/pro-components';
import {ConfigContext} from '../config.tsx';
import {Terminal} from '@xterm/xterm';
import {FitAddon} from 'xterm-addon-fit';

export default function Page() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [term] = useState(() => new Terminal({
        fontSize: 20,
        fontFamily: 'monospace',
    }));
    const [webSocket, setWebSocket] = useState<WebSocket | undefined>();
    const config = useContext(ConfigContext);
    const fitAddon = new FitAddon();

    useEffect(() => {
        const terminalDiv = document.getElementById('terminal');
        window.addEventListener('resize', () => fitAddon.fit());
        if (terminalDiv) {
            term.loadAddon(fitAddon);
            term.open(terminalDiv);
            fitAddon.fit();
            term.writeln('欢迎使用 LoongPanel 终端 ...');
        }
    }, [fitAddon, term]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = (values: { host: string, port: string, user: string, pwd: string }) => {
        setIsModalVisible(false);
        const {host, port, user, pwd} = values;
        webSocket?.close();
        term.clear();
        term.writeln(`🔄   正在连接到窗口 [${user}@${host}:${port}] ...`);
        const wsUrl = config?.WS_URL ? `${config.WS_URL}/api/ws/screen?host=${host}&port=${port}&user=${user}&pwd=${pwd}` :
            `ws://${window.location.host}/api/ws/screen?host=${host}&port=${port}&user=${user}&pwd=${pwd}`;
        console.log(wsUrl)
        const ws = new WebSocket(wsUrl);
        ws.onmessage = event => term.write(event.data);
        term.onData(data => ws.send(data));
        setWebSocket(ws);
        term.writeln('✅   链接成功.');
        fitAddon.fit();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Button type="primary" onClick={showModal} style={{margin: 10}}>
                连接 SSH
            </Button>
            <Modal title="输入 SSH 服务器信息" open={isModalVisible} onCancel={handleCancel} footer={null}>
                <ProForm onFinish={handleOk}>
                    <ProFormText name="host" label="Host" initialValue="127.0.0.1"/>
                    <ProFormText name="port" label="Port" initialValue="22"/>
                    <ProFormText name="user" label="User" initialValue="root"/>
                    <ProFormText name="pwd" label="Password" fieldProps={{type: 'password'}}/>
                </ProForm>
            </Modal>
            <ProCard id="TerminalCard">
                <link rel="stylesheet" href="https://cdn1.d5v.cc/CDN/Project/LoongPanel/static/xterm.css"/>
                <div id="terminal" style={{height: '700px', width: '100%'}}/>
            </ProCard>
        </>
    );
}
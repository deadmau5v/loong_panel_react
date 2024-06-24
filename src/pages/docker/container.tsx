import {useEffect, useState} from 'react';
import {ProCard} from '@ant-design/pro-components';
import {Card, Button, Badge, Space, Drawer, Descriptions, message} from 'antd';
import {config} from "../../config.tsx";

interface ContainerData {
    Id: string;
    Names: string[];
    Image: string;
    ImageID: string;
    Command: string;
    Created: number;
    Ports: {
        IP: string;
        PrivatePort: number;
        PublicPort: number;
        Type: string;
    }[];
    Labels: {
        [key: string]: string;
    };
    State: string;
    Status: string;
    HostConfig: {
        NetworkMode: string;
    };
    NetworkSettings: {
        Networks: {
            [key: string]: {
                IPAMConfig: null;
                Links: null;
                Aliases: null;
                MacAddress: string;
                DriverOpts: null;
                NetworkID: string;
                EndpointID: string;
                Gateway: string;
                IPAddress: string;
                IPPrefixLen: number;
                IPv6Gateway: string;
                GlobalIPv6Address: string;
                GlobalIPv6PrefixLen: number;
                DNSNames: null;
            };
        };
    };
    Mounts: {
        Type: string;
        Source: string;
        Destination: string;
        Mode: string;
        RW: boolean;
        Propagation: string;
    }[];
}

export default function Page() {
    const [containerData, setContainerData] = useState<ContainerData[] | null>(null);
    const [showDetail, setShowDetail] = useState(false);
    const [detailData, setDetailData] = useState<ContainerData | null>(null);
    const [messageApi, contextHolder] = message.useMessage();


    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(config?.API_URL + '/api/v1/docker/containers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("SESSION") || "",
                }
            });
            const result = await response.json();
            if (result.code === 0) {
                setContainerData(result.data);
            }
        };

        fetchData();
    }, []);

    if (!containerData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {contextHolder}
            <ProCard title="Docker 容器管理">
                {containerData.map((container, index) => (
                    <Card
                        key={index}
                        style={{marginBottom: 16}}
                        className={"container-card"}
                        title={container.Names.join(', ').replace("/", "")}
                        extra={
                            <Space>
                                <Badge
                                    status={container.State === "running" ? "success" : "error"}
                                    text={container.State === "running" ? "运行中" : "未运行"}
                                />
                            </Space>
                        }
                    >
                        <div>
                            <div>
                                <Descriptions column={2} labelStyle={{width: 100}}>
                                    <Descriptions.Item label="镜像">{container.Image}</Descriptions.Item>
                                    <Descriptions.Item label="创建时间">
                                        {new Date(container.Created * 1000).toLocaleString()}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="状态">{
                                        // 状态转为中文
                                        container.Status
                                            .replace("Up ", "已启动 ")
                                            .replace("Exited ", "已停止 ")
                                            .replace("Created ", "已创建 ")
                                    }</Descriptions.Item>
                                    {/* 只显示复制按钮 ID太长了 */}
                                    <Descriptions.Item label="容器ID">
                                        <a
                                            type="link"
                                            onClick={() => {
                                                navigator.clipboard.writeText(container.Id)
                                                messageApi.success("复制成功", 1)
                                            }}
                                        >
                                            {container.Id.toString().slice(0, 15) + "...  (点击复制)"}
                                        </a>
                                    </Descriptions.Item>
                                </Descriptions>
                                <Space>
                                    {/* 操作 */}
                                    <Button type="primary" disabled={container.State == "running"}>开启</Button>
                                    <Button danger disabled={container.State != "running"}>关闭</Button>
                                    <Button danger>删除</Button>
                                    <Button onClick={() => {
                                        setShowDetail(true)
                                        setDetailData(container)
                                    }}>详细</Button>
                                </Space>
                            </div>
                        </div>
                    </Card>
                ))}
            </ProCard>
            {/*   使用抽屉展示详细   */}
            <Drawer
                title="详细信息"
                placement="right"
                closable={false}
                onClose={() => setShowDetail(false)}
                open={showDetail}
                width={800}
            >
                {/*  使用键值对展示 多个值折叠  */}
                {detailData && (
                    <>
                        <Descriptions title="基本信息" bordered column={1} labelStyle={{width: 180}}>
                            <Descriptions.Item label="ID">{detailData.Id}</Descriptions.Item>
                            <Descriptions.Item
                                label="名称">{detailData.Names.map((x) => (x.replace("/", ""))).join(', ')}</Descriptions.Item>
                            <Descriptions.Item label="镜像">{detailData.Image}</Descriptions.Item>
                            <Descriptions.Item label="镜像ID">{detailData.ImageID}</Descriptions.Item>
                            <Descriptions.Item label="命令">{detailData.Command}</Descriptions.Item>
                            <Descriptions.Item label="网络模式">{detailData.HostConfig.NetworkMode}</Descriptions.Item>
                            <Descriptions.Item
                                label="创建时间">{new Date(detailData.Created * 1000).toLocaleString()}</Descriptions.Item>
                            <Descriptions.Item label="状态">{detailData.Status}</Descriptions.Item>
                        </Descriptions>
                        <Descriptions title="挂载信息" bordered column={1} labelStyle={{width: 180}}
                                      style={{marginTop: 10}}>
                            {detailData.Mounts.map((mount, index) => (
                                <Descriptions.Item key={index} label={mount.Type}>
                                    <p>源: {mount.Source}</p>
                                    <p>目标: {mount.Destination}</p>
                                    <p>读写: {mount.RW ? "是" : "否"}</p>
                                </Descriptions.Item>
                            ))}
                        </Descriptions>
                        <Descriptions title="网络信息" bordered column={1} labelStyle={{width: 180}}
                                      style={{marginTop: 10}}>
                            {Object.entries(detailData.NetworkSettings.Networks).map(([key, value], index) => (
                                <Descriptions.Item key={index} label={key}>
                                    <p>IP: {value.IPAddress}</p>
                                    <p>网关: {value.Gateway}</p>
                                </Descriptions.Item>
                            ))}
                            {/*  端口映射  */}
                            <Descriptions.Item label="端口映射">
                                {detailData.Ports.map((port, index) => (
                                    port.IP &&
                                    <p key={index}>{port.IP}:{port.PublicPort} → {port.PrivatePort}/{port.Type}</p>
                                ))}
                            </Descriptions.Item>
                        </Descriptions>
                        {/*  标签  */}
                        <Descriptions title="标签" bordered column={1} labelStyle={{width: 180}}
                                      style={{marginTop: 10}}>
                            {Object.entries(detailData.Labels).map(([key, value], index) => (
                                <Descriptions.Item key={index} label={key}>{value}</Descriptions.Item>
                            ))}
                        </Descriptions>
                    </>
                )}

            </Drawer>
        </>
    );
}
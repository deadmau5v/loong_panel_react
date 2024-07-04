import {Group, ProCard} from "@ant-design/pro-components";
import {useEffect, useState} from "react";
import {config} from "../../config.tsx";
import {Card, Descriptions, Collapse, message, Button, Drawer, Form, Input, Space} from "antd";

export interface Request {
    code: number;
    data: ImageData[];
}

export interface ImageData {
    Containers: number;
    Created: number;
    Id: string;
    Labels: { [key: string]: string };
    ParentId: string;
    RepoDigests: string[];
    RepoTags: string[] | null;
    SharedSize: number;
    Size: number;
}

const memoryUnits = ["B", "KB", "MB", "GB"];

function ChangeMemory(n: number, showUnit: boolean = true) {
    let unitIndex = 0;
    while (n >= 1024 && unitIndex < memoryUnits.length - 1) {
        n /= 1024;
        unitIndex++;
    }
    return n.toFixed(2) + (showUnit ? memoryUnits[unitIndex] : "");
}


export default function Page() {
    const [imageData, setImageData] = useState<ImageData[] | null>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [showDetail, setShowDetail] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(config?.API_URL + '/api/v1/docker/images', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include"
            });
            const result = await response.json();
            if (result.status === 0) {
                setImageData(result.data);
            }
        };

        fetchData();
    }, []);

    const handleCreate = (image: ImageData) => {
        console.log('创建容器:', image);
        // TODO: 实现创建容器的 API 调用
        setShowDetail(false);
        form.resetFields();
    };

    return <>
        {contextHolder}
        <ProCard title={"Docker 镜像管理"}>
            {imageData?.map((image) => (
                <Card
                    key={image.Id}
                    title={image.RepoTags?.join(", ") || image.Id}
                >
                    <Descriptions
                        column={1}
                        bordered
                    >
                        <Descriptions.Item label={"Id"}>
                            <a onClick={() => {
                                navigator.clipboard.writeText(image.Id.replace("sha256:", ""))
                                messageApi.success("复制成功", 1)

                            }}>{image.Id.replace("sha256:", "").slice(0, 20) + "...  (点击复制)"}</a>
                        </Descriptions.Item>
                        {/*<Descriptions.Item label={"RepoDigests"}>*/}
                        {/*    {image.RepoDigests?.map((digest) => {*/}
                        {/*        return <a onClick={() => {*/}
                        {/*            navigator.clipboard.writeText(digest)*/}
                        {/*            messageApi.success("复制成功", 1)*/}
                        {/*        }}>{digest.slice(0, 20) + "...  (点击复制)"}</a>*/}
                        {/*    })}*/}
                        {/*</Descriptions.Item>*/}
                        {/*<Descriptions.Item label={"Containers"}>{image.Containers}</Descriptions.Item>*/}
                        <Descriptions.Item label={"大小"}>{ChangeMemory(image.Size)}</Descriptions.Item>
                        {/*<Descriptions.Item label={"SharedSize"}>{image.SharedSize}</Descriptions.Item>*/}
                        {
                            image.Labels && <Descriptions.Item label="Labels">
                                <Collapse ghost>
                                    <Collapse.Panel header="展开查看标签" key="1">
                                        <Descriptions column={1} bordered size="small">
                                            {Object.entries(image.Labels).map(([key, value]) => (
                                                <Descriptions.Item key={key} label={key}>
                                                    {value}
                                                </Descriptions.Item>
                                            ))}
                                        </Descriptions>
                                    </Collapse.Panel>
                                </Collapse>
                            </Descriptions.Item>
                        }
                        <Descriptions.Item label={"操作"}>
                            <Group>

                                <Button onClick={() => {
                                    {
                                        /*Todo 实现功能*/
                                    }
                                    setShowDetail(true)
                                    setSelectedImage(image)
                                }}>启动</Button>
                                <Button danger onClick={() => {
                                    {
                                        /*Todo 实现功能*/
                                    }
                                }}>删除</Button>
                            </Group>
                        </Descriptions.Item>
                    </Descriptions>


                </Card>
            ))}
        </ProCard>
        <Drawer
            title="启动新容器"
            placement="right"
            closable={false}
            onClose={() => {
                setShowDetail(false);
                form.resetFields();
            }}
            open={showDetail}
            width={800}
        >
            {selectedImage && (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreate}
                    initialValues={{
                        imageName: selectedImage.RepoTags?.[0] || selectedImage.Id,
                    }}
                >
                    <Form.Item
                        name="imageName"
                        label="镜像名称"
                    >
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item
                        name="containerName"
                        label="容器名称"
                        rules={[{required: true, message: '请输入容器名称'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.List name="ports">
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map(({key, name, ...restField}) => (
                                    <Space key={key} style={{display: 'flex', marginBottom: 8}} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'hostPort']}
                                            rules={[{required: true, message: '请输入主机端口'}]}
                                        >
                                            <Input placeholder="主机端口"/>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'containerPort']}
                                            rules={[{required: true, message: '请输入容器端口'}]}
                                        >
                                            <Input placeholder="容器端口"/>
                                        </Form.Item>
                                        <Button onClick={() => remove(name)} type="link" danger>
                                            删除
                                        </Button>
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block>
                                        添加端口映射
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Form.List name={"envs"}>
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map(({key, name, ...restField}) => (
                                    <Space key={key} style={{display: 'flex', marginBottom: 8}} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'key']}
                                            rules={[{required: true, message: '请输入环境变量名'}]}
                                        >
                                            <Input placeholder="环境变量名"/>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'value']}
                                            rules={[{required: true, message: '请输入环境变量值'}]}
                                        >
                                            <Input placeholder="环境变量值"/>
                                        </Form.Item>
                                        <Button onClick={() => remove(name)} type="link" danger>
                                            删除
                                        </Button>
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block>
                                        添加环境变量
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Form.List name={"volumes"}>
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map(({key, name, ...restField}) => (
                                    <Space key={key} style={{display: 'flex', marginBottom: 8}} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'hostPath']}
                                            rules={[{required: true, message: '请输入主机路径'}]}
                                        >
                                            <Input placeholder="主机路径"/>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'containerPath']}
                                            rules={[{required: true, message: '请输入容器路径'}]}
                                        >
                                            <Input placeholder="容器路径"/>
                                        </Form.Item>
                                        <Button onClick={() => remove(name)} type="link" danger>
                                            删除
                                        </Button>
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block>
                                        添加卷映射
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            创建容器
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </Drawer>
    </>
}
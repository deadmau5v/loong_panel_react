import React, { useContext, useEffect, useState, lazy, Suspense } from "react";
import { config, ConfigContext } from "../config.tsx";
import { FolderOutlined, FileOutlined } from '@ant-design/icons';
import { Button, Drawer, Flex, Input, Card } from 'antd';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const FileComponent = lazy(() => import('../Components/file/File.tsx'));


// 转换内存单位
function ChangeMemory(n: number, showUnit: boolean = true) {
    const memoryUnits = ["B", "KB", "MB", "GB"];
    let unitIndex = 0;
    while (n >= 1024 && unitIndex < memoryUnits.length - 1) {
        n /= 1024;
        unitIndex++;
    }
    return n.toFixed(2) + (showUnit ? memoryUnits[unitIndex] : "");
}

// 文件类型
export type File = {
    name: string;// 文件名
    size: number;// 文件大小
    path: string;// 文件路径
    user: number;// 所有者
    group: number;// 所属组
    mode: number;// 权限
    time: number;// 修改时间
    isHidden: boolean;// 是否是隐藏文件
    isDir: boolean;// 是否是目录
    ext: string;// 扩展名
    isLink: boolean;// 是否为链接文件
    showTime: boolean;// 是否显示时间
    showEdit: boolean;// 是否显示编辑按钮
    showSize: boolean;// 是否显示大小
    content: string;
}

// 获取目录下的文件
function setDirFiles(path: string, setter: React.Dispatch<React.SetStateAction<File[]>>, API: string, setpath: React.Dispatch<React.SetStateAction<string>>) {
    setpath(path)
    fetch(API + "?path=" + encodeURIComponent(path), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include"

    })
        .then(res => res.json())
        .then(data => {
            console.log(data.files)
            setter(data.files)
        })
}


// 所有者
function caseUser(user: number) {
    switch (user) {
        case 0:
            return "root"
        default:
            return user
    }
}

// 所属组
function caseGroup(group: number) {
    switch (group) {
        case 0:
            return "root"
        default:
            return group
    }
}

async function readFile(file: File) {
    const API = config.API_URL + "/api/v1/files/read?path=";
    try {
        const res = await fetch(API + encodeURIComponent(file.path), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
        });
        const data = await res.json();
        file.content = data.data;
    } catch (error) {
        console.error("Failed to read file:", error);
    }
}

const languageMap: { [key: string]: string } = {
    'go': 'go',
    'py': 'python',
    'js': 'javascript',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'sh': 'bash',
    'bat': 'bat',
};

export default function Page() {
    const config = useContext(ConfigContext);
    const API = config?.API_URL + "/api/v1/files/dir"
    const [dataSource, setDataSource] = useState<File[]>([])
    const [path, setPath] = useState<string>("/")

    const columns = [
        {
            title: '',
            dataIndex: 'icon',
            key: 'icon',
            render: (_dom: React.ReactNode, record: File) => (
                record.isDir ? <FolderOutlined /> : <FileOutlined />
            ),
        },
        {
            title: '文件名',
            dataIndex: 'name',
            key: 'name',
            render: (_dom: React.ReactNode, record: File) => (
                record.isDir ?
                    <a onClick={() => setDirFiles(record.path, setDataSource, API, setPath)}>{record.name}</a> : record.name
            ),
            sorter: (a: File, b: File) => a.name.localeCompare(b.name),
        },
        {
            title: '大小',
            dataIndex: 'size',
            key: 'size',
            render: (_dom: React.ReactNode, record: File) => (
                record.isDir ? "" : ChangeMemory(record.size)
            ),
            sorter: (a: File, b: File) => a.isDir ? 1 : a.size - b.size,
        },
        {
            title: '路径',
            dataIndex: 'path',
            key: 'path',
            sorter: (a: File, b: File) => a.path.localeCompare(b.path),
        },
        {
            title: '所有者',
            dataIndex: 'user',
            key: 'user',
            render: (_dom: React.ReactNode, record: File) => (
                caseUser(record.user)
            ),
        },
        {
            title: '所属组',
            dataIndex: 'group',
            key: 'group',
            render: (_dom: React.ReactNode, record: File) => (
                caseGroup(record.group)
            ),
        },
        {
            title: '权限',
            dataIndex: 'mode',
            key: 'mode',
        },
        {
            title: '修改时间',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (_dom: React.ReactNode, record: File) => {
                if ({
                    "go": 1,
                    "txt": 1,
                    "java": 1,
                    "py": 1,
                    "c": 1,
                    "cpp": 1,
                    "js": 1,
                    "html": 1,
                    "css": 1,
                    "md": 1,
                    "json": 1,
                    "xml": 1,
                    "yml": 1,
                    "yaml": 1,
                    "conf": 1,
                    "properties": 1,
                    "sh": 1,
                    "bat": 1,
                    "cmd": 1,
                    "ps1": 1,
                    "psm1": 1,
                    "psd1": 1,
                    "ps1xml": 1,
                    "ini": 1,
                    "log": 1,
                    "csv": 1,
                    "tsv": 1,
                    "svg": 1
                }[record.ext] == 1) {
                    return (
                        <a onClick={async () => {
                            await readFile(record)
                            setSelectedFile(record);
                            setDrawerVisible(true);

                        }}>
                            查看
                        </a>
                    );
                }
            },
        }
    ]

    useEffect(() => {
        // 初始化时加载根目录文件
        setDirFiles(path, setDataSource, API, setPath);
    }, [path, API]);

    const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    return (
        <>
            <Card>
                <Suspense fallback={<div>Loading...</div>}>
                    <Flex>
                        <Button onClick={() => {
                            if (path === "/") {
                                return
                            }
                            const paths = path.split("/")
                            paths.pop()
                            setDirFiles(paths.join("/"), setDataSource, API, setPath)
                        }}>上一级
                        </Button>
                        <Input value={path} onChange={() => {
                        }} />
                    </Flex>

                    <FileComponent columns={columns} dataSource={dataSource} />

                    <Drawer
                        title="文件详情"
                        placement="right"
                        onClose={() => setDrawerVisible(false)}
                        open={drawerVisible}
                        width={1200}
                    >
                        {selectedFile && (
                            <div>
                                <p><strong>文件名:</strong> {selectedFile.name}</p>
                                <p>内容:</p>
                                <SyntaxHighlighter
                                    language={languageMap[selectedFile.ext] || 'text'}
                                >
                                    {selectedFile.content}
                                </SyntaxHighlighter>
                            </div>
                        )}
                    </Drawer>
                </Suspense>
            </Card>
        </>
    )
}


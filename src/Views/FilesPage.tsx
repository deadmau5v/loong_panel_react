import React, { useContext, useEffect, useState, lazy, Suspense } from "react";
import { config, ConfigContext } from "../config.tsx";
import { FolderOutlined, FileOutlined } from '@ant-design/icons';
import { Button, Drawer, Flex, Input, Card, Modal, message } from 'antd';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { HomeOutlined, CopyOutlined, EyeOutlined, DownloadOutlined, DeleteOutlined, EditOutlined, CompressOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

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

// 用到的API
// "/api/v1/files/dir" 列出
// "/api/v1/files/read" 读取
// "/api/v1/files/delete" 删除
// "/api/v1/files/move" 移动
// "/api/v1/files/rename" 重命名
// "/api/v1/files/decompress" 解压缩
// "/api/v1/files/compress" 压缩
// "/api/v1/files/download" 下载
// "/api/v1/files/upload" 上传

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
function setDirFiles(path: string, setter: React.Dispatch<React.SetStateAction<File[]>>, API: string, setpath: (path: string) => void) {
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

const iconStyle = {
    backgroundColor: "",
    color: "#ff8383",
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

const deleteFile = (record: File) => {
    fetch(config?.API_URL + "/api/v1/files/delete?path=" + encodeURIComponent(record.path), {
        method: 'POST',
        credentials: "include"
    })
}

const compressFile = (record: File) => {
    fetch(config?.API_URL + "/api/v1/files/compress?path=" + encodeURIComponent(record.path), {
        method: 'POST',
        credentials: "include"
    })
}
const decompressFile = (record: File) => {
    fetch(config?.API_URL + "/api/v1/files/decompress?path=" + encodeURIComponent(record.path), {
        method: 'POST',
        credentials: "include"
    })
}

export default function Page() {

    const navigate = useNavigate();
    const location = useLocation();


    const getInitPath = () => {
        const searchParams = new URLSearchParams(location.search);
        const pathParam = searchParams.get('path');
        if (pathParam) {
            return pathParam
        }
        return "/"
    }

    const config = useContext(ConfigContext);
    const API = config?.API_URL + "/api/v1/files/dir"
    const [dataSource, setDataSource] = useState<File[]>([])
    const [path, setPath] = useState<string>(getInitPath())
    const [showReadFile, setShowReadFile] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [moveFile, setMoveFile] = useState<File | null>(null);
    const [renameValue, setRenameValue] = useState<string>("");
    const [showRenameModal, setShowRenameModal] = useState<boolean>(false);

    const setPathPlus = (path: string) => {
        setPath(path);
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('path', path);
        navigate({ ...location, search: searchParams.toString() });
    }

    const reloadDir = () => {
        setDirFiles(path, setDataSource, API, setPathPlus);
    }

    const orenameFile = async (record: File) => {
        if (renameValue.trim() == "") {
            message.warning("文件名不能为空")
            return
        }

        if (renameValue == selectedFile?.name) {
            return
        }

        await fetch(config?.API_URL + "/api/v1/files/rename?path=" + encodeURIComponent(record.path) + "&name=" + encodeURIComponent(renameValue), {
            method: 'POST',
            credentials: "include"
        })

        reloadDir()
    }

    // 读取操作
    const operation = (_dom: React.ReactNode, record: File) => {
        const operation_list = []

        // 查看操作
        if ({
            "go": 1, "txt": 1, "java": 1, "py": 1, "c": 1, "cpp": 1, "js": 1,
            "html": 1, "css": 1, "md": 1, "json": 1, "xml": 1, "yml": 1, "yaml": 1,
            "conf": 1, "properties": 1, "sh": 1, "bat": 1, "cmd": 1, "ps1": 1, "psm1": 1,
            "psd1": 1, "ps1xml": 1, "ini": 1, "log": 1, "csv": 1, "tsv": 1, "svg": 1
        }[record.ext] == 1) {
            operation_list.push(
                <Button type="link" onClick={async () => {
                    await readFile(record)
                    setSelectedFile(record);
                    setShowReadFile(true);
                }} icon={<EyeOutlined style={iconStyle} />}>
                    查看
                </Button>
            )
        }

        // 下载操作
        operation_list.push(
            <Button type="link" onClick={async () => {
                // 打开新窗口下载
                window.open(config?.API_URL + "/api/v1/files/download?path=" + encodeURIComponent(record.path), '_blank');
            }} icon={<DownloadOutlined style={iconStyle} />}>
                下载
            </Button>
        )


        // 删除操作
        operation_list.push(
            <Button type="link" onClick={() => {
                Modal.confirm({
                    title: '确定删除?',
                    content: '如果你点击确定，文件将被永久删除',
                    onOk: async () => {
                        await deleteFile(record);
                        reloadDir()
                    },
                });
            }} icon={<DeleteOutlined style={iconStyle} />}>
                删除
            </Button>
        )

        // 移动操作
        operation_list.push(
            <Button type="link" onClick={async () => {
                setSelectedFile(record)
                setMoveFile(record)
                reloadDir()
            }} icon={<CopyOutlined style={iconStyle} />}>
                移动
            </Button>
        )


        // 重命名
        operation_list.push(
            <Button type="link" onClick={async () => {
                // 重命名
                setShowRenameModal(true)
                setRenameValue(record.name)
                setSelectedFile(record)
            }} icon={<EditOutlined style={iconStyle} />}>
                重命名
            </Button>
        )


        // 压缩
        operation_list.push(
            <Button type="link" onClick={async () => {
                await compressFile(record)
                reloadDir()
            }} icon={<CompressOutlined style={iconStyle} />}>
                压缩
            </Button>
        )

        // 解压
        if ({
            "tar": 1, "gz": 1, "xz": 1
        }[record.ext] == 1) {
            operation_list.push(
                <Button type="link" onClick={async () => {
                    await decompressFile(record)
                    reloadDir()
                }} icon={<CompressOutlined style={iconStyle} />}>
                    解压
                </Button>
            )
        }

        return operation_list
    }

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
                    <a onClick={() => setDirFiles(record.path, setDataSource, API, setPathPlus)}>{record.name}</a> : record.name
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
            render: operation
        }
    ]

    useEffect(() => {
        // 初始化时加载根目录文件
        setDirFiles(path, setDataSource, API, setPathPlus);
    }, [path, API]);


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
                            setDirFiles(paths.join("/"), setDataSource, API, setPathPlus)
                        }}>上一级
                        </Button>

                        <Button icon={<CopyOutlined style={{
                            backgroundColor: "white",
                            color: "black",
                        }} />} onClick={() => {
                            navigator.clipboard.writeText(path)
                        }} />

                        <Button icon={<ReloadOutlined style={{
                            backgroundColor: "white",
                            color: "black",
                        }} />} onClick={reloadDir} />

                        <Button icon={<HomeOutlined style={{
                            backgroundColor: "white",
                            color: "black",
                        }} />} onClick={() => {
                            setPathPlus("/")
                        }} />
                        <Input value={path} onChange={(e) => setPathPlus(e.target.value)} autoComplete="off" spellCheck="false" />
                    </Flex>

                    <FileComponent columns={columns} dataSource={dataSource} moveFile={moveFile} path={path} setMoveFile={setMoveFile} reload={reloadDir} />

                    <Drawer
                        title="文件详情"
                        placement="right"
                        onClose={() => setShowReadFile(false)}
                        open={showReadFile}
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

                    {
                        showRenameModal &&
                        <Modal title="请输入新的名字" open={true} onOk={() => {
                            if (selectedFile) {
                                orenameFile(selectedFile)
                                setShowRenameModal(false)
                            }
                        }} onCancel={() => {
                            setShowRenameModal(false)
                        }}>
                            <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
                        </Modal>
                    }
                </Suspense>
            </Card>
        </>
    )
}


import React, {useContext, useEffect, useState, lazy, Suspense} from "react";
import {ConfigContext} from "../config.tsx";
import {FolderOutlined, FileOutlined} from '@ant-design/icons';
import {useAuth} from "../plugins/AuthContext.tsx";

const FileComponent = lazy(() => import('../plugins/file/File.tsx'));


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
}

// 获取目录下的文件
function setDirFiles(path: string, setter: React.Dispatch<React.SetStateAction<File[]>>, API: string) {
    fetch(API + "?path=" + encodeURIComponent(path), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("SESSION") || "",

        }

    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
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

export default function Page() {
    const config = useContext(ConfigContext);
    const API = config?.API_URL + "/api/v1/files/dir"
    const [dataSource, setDataSource] = useState<File[]>([])

    // 验证是否登录
    const {logined} = useAuth()
    if (!logined) {
        window.location.href = "/login"
    }

    const columns = [
        {
            title: '',
            dataIndex: 'icon',
            key: 'icon',
            render: (_dom: React.ReactNode, record: File) => (
                record.isDir ? <FolderOutlined/> : <FileOutlined/>
            ),
        },
        {
            title: '文件名',
            dataIndex: 'name',
            key: 'name',
            render: (_dom: React.ReactNode, record: File) => (
                record.isDir ?
                    <a onClick={() => setDirFiles(record.path, setDataSource, API)}>{record.name}</a> : record.name
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
    ]

    useEffect(() => {
        // 初始化时加载根目录文件
        setDirFiles("/", setDataSource, API)
    }, [])

    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <FileComponent columns={columns} dataSource={dataSource}/>
            </Suspense>
        </>
    )
}


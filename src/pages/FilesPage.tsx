import React, {useContext, useEffect, useState, lazy, Suspense} from "react";
import {ConfigContext} from "../config.tsx";
import {FolderOutlined, FileOutlined} from '@ant-design/icons';

const FileComponent = lazy(() => import('../plugins/file/File.tsx'));

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
    fetch(API + "?path=" + encodeURIComponent(path))
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setter(data.files)
        })
}

export default function Page() {
    const config = useContext(ConfigContext);
    const API = config?.API_URL + "/api/v1/files/dir"
    const [dataSource, setDataSource] = useState<File[]>([])
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
        },
        {
            title: '大小',
            dataIndex: 'size',
            key: 'size',
        },
        {
            title: '路径',
            dataIndex: 'path',
            key: 'path',
        },
        {
            title: '所有者',
            dataIndex: 'user',
            key: 'user',
        },
        {
            title: '所属组',
            dataIndex: 'group',
            key: 'group',
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
                <FileComponent columns={columns} dataSource={dataSource} />
            </Suspense>
        </>
    )
}
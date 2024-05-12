import {ProTable} from "@ant-design/pro-components";
import React from "react";

// 文件类型
type File = {
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

export type column = {
    title: string,
    dataIndex: string,
    key: string,
}

type FileComponentProps = {
    columns: column[];
    dataSource: File[];
}

const FileComponent: React.FC<FileComponentProps> = ({columns, dataSource}) => {
    return (
        <ProTable<File>
            columns={columns}
            dataSource={dataSource}
            rowKey="path"
            search={false}
            options={false}
            pagination={false}
            dateFormatter="string"
        />
    )
}

export default FileComponent;
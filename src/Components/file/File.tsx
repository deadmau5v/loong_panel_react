import { ProTable, ProColumns } from "@ant-design/pro-components";
import React from "react";
import { SortOrder } from "antd/es/table/interface";
import { Button, message } from "antd";
import { config } from "../../config";

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
    content: string
}

type FileComponentProps = {
    columns: ProColumns<File>[];
    dataSource: File[];
    moveFile: File | null;
    path: string;
    setMoveFile: (moveFile: File | null) => void;
    reload: () => void;
}

const omoveFile = (path: string, moveFile: File | null, setMoveFile: (moveFile: File | null) => void, reload: () => void) => {
    if (moveFile) {
        fetch(config?.API_URL + "/api/v1/files/move?path=" + encodeURIComponent(moveFile.path) + "&dest=" + encodeURIComponent(path + "/" + moveFile.name), {
            method: 'POST',
            credentials: "include"
        }).then(res => {
            res.json().then((data) => {
                if (data.status != 0) {
                    message.error(data.msg)
                } else {
                    message.success("移动成功")
                }
            })
        })
    }
    setMoveFile(null);
    reload();
}

const FileComponent: React.FC<FileComponentProps> = ({ columns, dataSource, moveFile, path, setMoveFile, reload }) => {
    const modifiedColumns = columns.map(column => {
        if (column.dataIndex === 'name') {
            return {
                ...column,
                defaultSortOrder: 'ascend' as SortOrder, // 默认升序排序
                sorter: (a: File, b: File) => {
                    // 先按照isDir排序 如果isDir相同 再按照name排序
                    if (a.isDir === b.isDir) {
                        return a.name.localeCompare(b.name);
                    }
                    return a.isDir ? -1 : 1;
                },
            };
        }
        return column;
    });

    return (
        <ProTable<File>
            columns={modifiedColumns}
            dataSource={dataSource}
            rowKey="path"
            search={false}
            options={false}
            pagination={false}
            dateFormatter="string"
            toolbar={{
                actions: [
                    <>
                        {moveFile && <Button type="primary" onClick={() => omoveFile(path, moveFile, setMoveFile, reload)}>移动到</Button>}
                    </>
                ]
            }}
        />
    )
}

export default FileComponent;
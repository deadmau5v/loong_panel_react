import {
    HomeFilled,
    FolderOpenFilled,
    MergeFilled,
    UserOutlined,
} from '@ant-design/icons';

export default {
    route: {
        path: '',
        routes: [
            {
                path: '/',
                name: '首页',
                icon: <HomeFilled/>,
            },
            {
                path: '/terminal',
                name: '终端',
                icon: <MergeFilled/>,
            },
            {
                path: '/files',
                name: '文件',
                icon: <FolderOpenFilled/>,
            },
            {
                path: "/user",
                name: "用户",
                icon: <UserOutlined/>,
            },
            {
                path: "/auth",
                name: "权限",
                icon: <UserOutlined/>,
            //     二级菜单
                routes: [
                    {
                        path: "/auth/global",
                        name: "全局设置",
                    },
                    {
                        path: "/auth/user",
                        name: "用户管理",
                    },
                    {
                        path: "/auth/role",
                        name: "角色管理",
                    },
                ]
            }
        ],
    },
};
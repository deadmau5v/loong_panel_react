import {
    HomeFilled,
    FolderOpenFilled,
    MergeFilled,
    UserOutlined,
    ContactsOutlined,
    ContainerOutlined,
    BarChartOutlined,
    DockerOutlined,
    AppstoreOutlined,
    CodeSandboxOutlined,
} from '@ant-design/icons';

export default {
    route: {
        path: '',
        routes: [
            {
                path: '/',
                name: '首页',
                icon: <HomeFilled />,
            },
            {
                path: '/terminal',
                name: '终端',
                icon: <MergeFilled />,
            },
            {
                path: '/files',
                name: '文件',
                icon: <FolderOpenFilled />,
            },
            {
                path: "/user",
                name: "用户",
                icon: <UserOutlined />,
            },
            {
                path: "/auth",
                name: "权限",
                icon: <ContactsOutlined />,
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
            }, {
                path: "/log",
                name: "日志",
                icon: <ContainerOutlined />,
            }, {
                path: "/appstore",
                name: "应用",
                icon: <AppstoreOutlined />,
            }, {
                path: "/docker",
                name: "Docker管理",
                icon: <DockerOutlined />,
                routes: [
                    {
                        path: "/docker/container",
                        name: "容器",
                    },
                    {
                        path: "/docker/image",
                        name: "镜像",
                    },
                ]
            }, {
                path: "/status",
                name: "状态",
                icon: <BarChartOutlined />,
            }, {
                path: "/clamav",
                name: "病毒扫描",
                icon: <CodeSandboxOutlined />,
            },
            {
                path: "/inspection",
                name: "一键巡检",
                icon: <CodeSandboxOutlined />,
            }
        ],
    },
};
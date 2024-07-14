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
    BellOutlined,
    SafetyOutlined,
    SettingOutlined,
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
                name: "我的",
                icon: <UserOutlined />,
            },
            {
                path: "/log",
                name: "日志",
                icon: <ContainerOutlined />,
            },
            {
                path: "/appstore",
                name: "应用",
                icon: <AppstoreOutlined />,
            },
            {
                path: "/status",
                name: "状态",
                icon: <BarChartOutlined />,
            },
            {
                path: "/auth",
                name: "权限",
                icon: <ContactsOutlined />,
                routes: [
                    {
                        path: "/auth/user",
                        name: "用户",
                    },
                    {
                        path: "/auth/role",
                        name: "角色",
                    },
                ]
            },
            {
                path: "/docker",
                name: "Docker管理",
                icon: <DockerOutlined />,
                routes: [
                    {
                        path: "/docker/container",
                        name: "容器管理",
                    },
                    {
                        path: "/docker/image",
                        name: "镜像管理",
                    },
                ]
            },
            {
                path: "/clamav",
                name: "病毒扫描",
                icon: <CodeSandboxOutlined />,
            },
            {
                path: "/inspection",
                name: "一键巡检",
                icon: <SafetyOutlined />,
            },
            {
                path: "/notice",
                name: "预警通知",
                icon: <BellOutlined />,
            },
            {
                path: "/settings",
                name: "面板设置",
                icon: <SettingOutlined />,
            }
        ],
    },
};
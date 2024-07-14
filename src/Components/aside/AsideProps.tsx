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
} from '@ant-design/icons';

export default {
    route: {
        path: '',
        routes: [
            {
                path: '/',
                name: '面板首页',
                icon: <HomeFilled />,
            },
            {
                path: '/terminal',
                name: '网页终端',
                icon: <MergeFilled />,
            },
            {
                path: '/files',
                name: '文件管理',
                icon: <FolderOpenFilled />,
            },
            {
                path: "/user",
                name: "用户后台",
                icon: <UserOutlined />,
            },
            {
                path: "/log",
                name: "日志中心",
                icon: <ContainerOutlined />,
            },
            {
                path: "/appstore",
                name: "应用市场",
                icon: <AppstoreOutlined />,
            },
            {
                path: "/status",
                name: "状态监控",
                icon: <BarChartOutlined />,
            },
            {
                path: "/auth",
                name: "权限管理",
                icon: <ContactsOutlined />,
                routes: [
                    {
                        path: "/auth/user",
                        name: "用户管理",
                    },
                    {
                        path: "/auth/role",
                        name: "角色管理",
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
            }
        ],
    },
};
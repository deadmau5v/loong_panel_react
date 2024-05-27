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
            }
        ],
    },
};
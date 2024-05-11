import {
    HomeFilled,
    FolderOpenFilled,
    MergeFilled,
    CrownFilled,
} from '@ant-design/icons';

export default {
    route: {
        path: '',
        routes: [
            {
                path: '/',
                name: '首页',
                icon: <HomeFilled/>,
                component: '',
            },
            {
                path: '/terminal',
                name: '终端',
                icon: <MergeFilled />,
                component: '',
            },
            {
                path: '/files',
                name: '文件',
                icon: <FolderOpenFilled />,
                component: '',
            },            {
                path: '/test',
                name: '测试',
                icon: <CrownFilled />,
                component: '',
            },
            // { 二级标题
            //   path: '/admin',
            //   name: '管理页',
            //   icon: <CrownFilled />,
            //   access: '',
            //   component: '.',
            //   routes: [
            //     {
            //       path: '/admin/sub-page1',
            //       name: '一级页面',
            //       icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
            //       component: './Welcome',
            //     },
            //   ],
            // },
            // { 外链
            //   path: 'https://ant.design',
            //   name: 'Ant Design 官网外链',
            //   icon: <ChromeFilled />,
            // },
        ],
    },
    // appList: [
    //   //   添加APP
    //   {
    //     icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    //     title: '标题',
    //     desc: '简介',
    //     url: '#地址',
    //   },
    // ],
};
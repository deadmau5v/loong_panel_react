import {Card, Switch} from "antd";
import {ProCard} from "@ant-design/pro-components";
import Change from "../../plugins/auth/Change.tsx";

function Page() {
    return <>
        <ProCard>
            {/*导航栏 显示全局设置 用户管理 角色管理*/}
            <Change active={1}/>

            {/*全局设置*/}
            <Card>
                是否允许注册: <Switch checkedChildren="允许" unCheckedChildren="禁用" defaultChecked/>
                是否邮箱登录: <Switch checkedChildren="允许" unCheckedChildren="禁用" defaultChecked/>
            </Card>
        </ProCard>
    </>
}

export default Page
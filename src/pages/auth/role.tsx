import {Card} from "antd";
import {ProCard} from "@ant-design/pro-components";
import Change from "../../plugins/auth/Change.tsx";

function Page() {
    return <>
        <ProCard>
            {/*导航栏 显示全局设置 用户管理 角色管理*/}
            <Change active={3}/>

            {/*角色*/}
            <Card>

            </Card>
        </ProCard>
    </>
}

export default Page
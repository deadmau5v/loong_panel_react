import {Radio} from "antd";

function Plugin({active}: {active: number}) {
    return <>
        <Radio.Group defaultValue={active.toString()} size="large">
            <Radio.Button value="1" onClick={() => {
                window.location.href = "/auth/global"
            }}>全局设置</Radio.Button>
            <Radio.Button value="2" onClick={() => {
                window.location.href = "/auth/user"
            }}>用户管理</Radio.Button>
            <Radio.Button value="3" onClick={() => {
                window.location.href = "/auth/role"
            }}>角色管理</Radio.Button>
        </Radio.Group>
    </>
}


export default Plugin
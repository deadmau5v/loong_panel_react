import LogoutCard from "../plugins/login/LogoutCard.tsx"
import {useAuth} from "../plugins/AuthContext.tsx";

export default function UserPage() {
    // 验证是否登录
    const { logined } = useAuth()
    if (!logined) {
        window.location.href = "/login"
    }
    return (
        <LogoutCard/>
    );
}
import {Button, Card} from "antd";
import React, {useContext} from "react";
import {ConfigContext} from "../../config.tsx";

function clearCookie() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
}

export default function Plugin({setLogined}: { setLogined: React.Dispatch<React.SetStateAction<boolean>> }) {
    const config = useContext(ConfigContext);
    const API = config?.API_URL + "/api/v1/auth/logout";

    return (
        <div>
            <Card title="Logout">
                <Button onClick={async () => {
                    await fetch(API, {
                        method: 'POST',
                        headers: {
                            'Cookie': document.cookie,
                            'Authorization': 'Bearer ' + document.cookie ? document.cookie.split("=")[1] : ''
                        }
                    })
                    setLogined(() => false)
                    document.cookie = ""
                    clearCookie()
                    window.location.href = "/"
                }
                }>退出登录</Button>
            </Card>
        </div>
    )
}
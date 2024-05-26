import {PageContainer, ProLayout} from '@ant-design/pro-components'
import {ReactElement, useState, Suspense, lazy, useEffect} from 'react'
import defaultProps from "./aside/AsideProps.tsx"
import logo from "./assets/logo.png"

const UserPage = lazy(() => import('./pages/UserPage.tsx'));
const HomePage = lazy(() => import('./pages/HomePage.tsx'));
const TerminalPage = lazy(() => import('./pages/TerminalPage.tsx'));
const FilesPage = lazy(() => import('./pages/FilesPage.tsx'));
const Error404Page = lazy(() => import('./pages/Error404Page.tsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.tsx'));

function App() {
    const [pathname, setPathname] = useState(window.location.pathname);
    const [logined, setLogined] = useState(false);

    // 验证Cookie
    useEffect(() => {
        fetch("http://localhost:8080/api/v1/ping", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': document.cookie,
                'Authorization': 'Bearer ' + document.cookie ? document.cookie.split("=")[1] : ''
            }
        }).then(res => {
            if (res.status === 401) {
                setPathname("/login")
            } else {
                setLogined(true)
            }
        })
    }, [])

    let page: ReactElement
    switch (pathname) {
        case "/":
            page = <HomePage/>
            break
        case "/files":
            page = <FilesPage/>
            break
        case "/terminal":
            page = <TerminalPage/>
            break
        case "/login":
            page = <LoginPage setlogined={setLogined}/>
            break
        case "/user":
            page = <UserPage setLogined={setLogined}/>
            break
        default:
            page = <Error404Page/>
    }

    if (!logined) {
        page = <LoginPage setlogined={setLogined}/>
    }

    return (
        <div
            id="test-pro-layout"
            style={{
                height: '100vh',
            }}
        >
            <ProLayout
                title={"LoongPanel"}
                logo={logo}
                className="AsideLogo"
                siderWidth={200}
                {...defaultProps}
                location={{
                    pathname,
                }}
                menuItemRender={(item, dom) => (
                    <div
                        onClick={() => {
                            setPathname(item.path || '/');
                        }}
                    >
                        {dom}
                    </div>
                )}
            >
                <PageContainer>
                    <Suspense fallback={<div>Loading...</div>}>
                        {page}
                    </Suspense>
                </PageContainer>
            </ProLayout>
        </div>
    )
}

export default App
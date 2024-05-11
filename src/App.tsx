import {PageContainer, ProLayout} from '@ant-design/pro-components'
import {ReactElement, useState} from 'react'
import defaultProps from "./aside/AsideProps.tsx"
import logo from "./assets/logo.png"
import HomePage from "./pages/HomePage.tsx"
import TerminalPage from "./pages/TerminalPage.tsx"
import FilesPage from "./pages/FilesPage.tsx"
import Error404Page from "./pages/Error404Page.tsx"
import Test from "./pages/Test.tsx"

function App() {


    const [pathname, setPathname] = useState('/');
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
        case "/test":
            page = <Test />
            break
        default:
            page = <Error404Page/>
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
                    {page}
                </PageContainer>
            </ProLayout>
        </div>
    )
}

export default App
// 入口
import {PageContainer, ProLayout} from '@ant-design/pro-components'
import {ReactElement, useState, Suspense, lazy} from 'react'
import defaultProps from "./aside/AsideProps.tsx"
import logo from "./assets/logo.png"

const HomePage = lazy(() => import('./pages/HomePage.tsx'));
const TerminalPage = lazy(() => import('./pages/TerminalPage.tsx'));
const FilesPage = lazy(() => import('./pages/FilesPage.tsx'));
const Error404Page = lazy(() => import('./pages/Error404Page.tsx'));

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
                    <Suspense fallback={<div>Loading...</div>}>
                        {page}
                    </Suspense>
                </PageContainer>
            </ProLayout>
        </div>
    )
}

export default App
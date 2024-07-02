import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Suspense, lazy} from 'react';
import {PageContainer, ProLayout} from '@ant-design/pro-components';
import defaultProps from "./Components/aside/AsideProps.tsx";
import logo from "./assets/logo.png";

const HomePage = lazy(() => import('./Views/HomePage'));
const TerminalPage = lazy(() => import('./Views/TerminalPage'));
const UserPage = lazy(() => import('./Views/UserPage'));
const FilesPage = lazy(() => import('./Views/FilesPage'));
const Error404Page = lazy(() => import('./Views/Error404Page'));
const LoginPage = lazy(() => import('./Views/LoginPage'));
const AuthRole = lazy(() => import('./Views/auth/role.tsx'));
const AuthUser = lazy(() => import('./Views/auth/user.tsx'));
const AuthGlobal = lazy(() => import('./Views/auth/global.tsx'));
const LogPage = lazy(() => import('./Views/LogPage.tsx'));
const AppStore = lazy(() => import('./Views/AppStorePage.tsx'));
const DockerContainer = lazy(() => import('./Views/docker/container.tsx'));
const DockerImage = lazy(() => import('./Views/docker/image.tsx'));

function App() {
    // 检查登录状态
    if (!localStorage.getItem("isLogin") && window.location.pathname != "/login") {
        window.location.href = "/login";
    }

    return (
        <Router>
            <div id="test-pro-layout" style={{height: '100vh'}}>
                <ProLayout
                    title={"LoongPanel"}
                    logo={logo}
                    className="AsideLogo"
                    siderWidth={200}
                    {...defaultProps}
                    menuItemRender={(menuItemProps, defaultDom) => {


                        if (menuItemProps.isUrl || !menuItemProps.path) {
                            return defaultDom;
                        }

                        return (
                            <div onClick={() => {
                                window.location.href = menuItemProps.path ? menuItemProps.path : "";
                            }}>
                                {defaultDom}
                            </div>
                        );
                    }}
                >
                    <PageContainer>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Routes>
                                <Route path="/" element={<HomePage/>}/>
                                <Route path="/files" element={<FilesPage/>}/>
                                <Route path="/terminal" element={<TerminalPage/>}/>
                                <Route path="/login" element={<LoginPage/>}/>
                                <Route path="/user" element={<UserPage/>}/>
                                <Route path="/auth/global" element={<AuthGlobal/>}/>
                                <Route path="/auth/user" element={<AuthUser/>}/>
                                <Route path="/auth/role" element={<AuthRole/>}/>
                                <Route path="/log" element={<LogPage/>}/>
                                <Route path="/appstore" element={<AppStore/>}/>
                                <Route path="/docker/container" element={<DockerContainer/>}/>
                                <Route path="/docker/image" element={<DockerImage/>}/>
                                <Route path="*" element={<Error404Page/>}/>
                            </Routes>
                        </Suspense>
                    </PageContainer>
                </ProLayout>
            </div>
        </Router>
    );
}

export default App;
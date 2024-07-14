import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { PageContainer, ProLayout } from '@ant-design/pro-components';
import defaultProps from "./Components/aside/AsideProps.tsx";
import logo from "./assets/logo.png";
import { config } from "./config.tsx";
import BackendOfflinePage from "./Views/NotRunning.tsx";
import LoadingPage from "./Views/Loading.tsx";

const HomePage = lazy(() => import('./Views/HomePage'));
const TerminalPage = lazy(() => import('./Views/TerminalPage'));
const UserPage = lazy(() => import('./Views/UserPage'));
const FilesPage = lazy(() => import('./Views/FilesPage'));
const Error404Page = lazy(() => import('./Views/Error404Page'));
const LoginPage = lazy(() => import('./Views/LoginPage'));
const AuthRole = lazy(() => import('./Views/auth/role.tsx'));
const AuthUser = lazy(() => import('./Views/auth/user.tsx'));
const LogPage = lazy(() => import('./Views/LogPage.tsx'));
const AppStore = lazy(() => import('./Views/AppStorePage.tsx'));
const DockerContainer = lazy(() => import('./Views/docker/container.tsx'));
const DockerImage = lazy(() => import('./Views/docker/image.tsx'));
const Status = lazy(() => import('./Views/StatusPage.tsx'));
const ClamavPage = lazy(() => import('./Views/ClamavPage.tsx'));
const InspectionPage = lazy(() => import('./Views/InspectionPage.tsx'));
const NoticePage = lazy(() => import('./Views/NoticePage.tsx'));
const SettingsPage = lazy(() => import('./Views/SettingsPage.tsx'));

/**
 * 应用组件
 */
function App() {
    // 检查登录状态
    useEffect(() => {
        if (!localStorage.getItem("isLogin") && window.location.pathname !== "/login") {
            window.location.href = "/login";
        }
    }, []);

    // 检查后端启动
    useEffect(() => {
        if (window.location.pathname !== "/not_run" && window.location.pathname !== "/login") {
            fetch(`${config.API_URL}/api/v1/ping`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include"
            })
                .then((response) => {
                    if (response.status === 401) {
                        localStorage.removeItem("isLogin");
                        window.location.href = "/login";
                    }
                })
                .catch(() => {
                    window.location.href = "/not_run";
                });
        }
    }, []);

    return (
        <Router>
            <div id="test-pro-layout" style={{ height: '100vh' }}>
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
                        <Suspense fallback={<LoadingPage />}>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/files" element={<FilesPage />} />
                                <Route path="/terminal" element={<TerminalPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/user" element={<UserPage />} />
                                <Route path="/auth/user" element={<AuthUser />} />
                                <Route path="/auth/role" element={<AuthRole />} />
                                <Route path="/log" element={<LogPage />} />
                                <Route path="/appstore" element={<AppStore />} />
                                <Route path="/docker/container" element={<DockerContainer />} />
                                <Route path="/docker/image" element={<DockerImage />} />
                                <Route path="/not_run" element={<BackendOfflinePage />} />
                                <Route path="/status" element={<Status />} />
                                <Route path="/clamav" element={<ClamavPage />} />
                                <Route path="/inspection" element={<InspectionPage />} />
                                <Route path="/notice" element={<NoticePage />} />
                                <Route path="/settings" element={<SettingsPage />} />
                                <Route path="*" element={<Error404Page />} />
                            </Routes>
                        </Suspense>
                    </PageContainer>
                </ProLayout>
            </div>
        </Router>
    );
}

export default App;
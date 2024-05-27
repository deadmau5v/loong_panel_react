import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Suspense, lazy, useEffect} from 'react';
import {PageContainer, ProLayout} from '@ant-design/pro-components';
import defaultProps from "./aside/AsideProps.tsx";
import logo from "./assets/logo.png";
import {useAuth} from "./plugins/AuthContext.tsx";

const HomePage = lazy(() => import('./pages/HomePage'));
const TerminalPage = lazy(() => import('./pages/TerminalPage'));
const UserPage = lazy(() => import('./pages/UserPage'));
const FilesPage = lazy(() => import('./pages/FilesPage'));
const Error404Page = lazy(() => import('./pages/Error404Page'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AuthRole = lazy(() => import('./pages/auth/role.tsx'));
const AuthUser = lazy(() => import('./pages/auth/user.tsx'));
const AuthGlobal = lazy(() => import('./pages/auth/global.tsx'));


function App() {
    const {setLogined} = useAuth()
    useEffect(() => {
        if (localStorage.getItem('SESSION')) {
            setLogined(true)
        } else {
            setLogined(false)
        }
    }, [setLogined])
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
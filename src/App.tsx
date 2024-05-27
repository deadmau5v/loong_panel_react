import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Suspense, lazy} from 'react';
import {PageContainer, ProLayout} from '@ant-design/pro-components';
import defaultProps from "./aside/AsideProps.tsx";
import logo from "./assets/logo.png";

const HomePage = lazy(() => import('./pages/HomePage'));
const TerminalPage = lazy(() => import('./pages/TerminalPage'));
const UserPage = lazy(() => import('./pages/UserPage'));
const FilesPage = lazy(() => import('./pages/FilesPage'));
const Error404Page = lazy(() => import('./pages/Error404Page'));
const LoginPage = lazy(() => import('./pages/LoginPage'));


function App() {


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
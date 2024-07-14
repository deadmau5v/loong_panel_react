import { ProCard } from '@ant-design/pro-components';
import loadingImage from '../assets/loading.png';
import { useRef } from 'react';

const LoadingPage = () => {
    const imgRef = useRef(null);

    return (
        <ProCard>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <img ref={imgRef} src={loadingImage} alt="加载中" style={{ animation: 'spin 2s linear infinite', width: '100px', height: '100px' }} />
                    <style>
                        {`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}
                    </style>
                    <div style={{ fontSize: '24px', marginTop: '10px' }}>
                        加载中
                    </div>
                </div>
            </div>

        </ProCard>
    );
};

export default LoadingPage;

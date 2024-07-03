import {Result, Button} from 'antd';

const Error404 = () => {

    return (
        <Result
            status="warning"
            title="404 页面不存在"
            subTitle="错误路径，请检查路径是否正确。"
            extra={[
                <Button type="primary" key="retry" onClick={() => {
                    window.location.href = "/"
                }}>
                    返回主页
                </Button>
            ]}
        />
    );
};

export default Error404;
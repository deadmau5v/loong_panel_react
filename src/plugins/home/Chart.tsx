import {Progress} from "antd";

export default function Plugin({title, percent}: { title: string, percent: number }) {

    return (
        <>
            <div id="Chart">
                <span>{title}</span>
                <Progress type="dashboard" percent={percent} strokeColor="#ff8383"/>
            </div>
        </>
    )
}
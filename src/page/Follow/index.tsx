import React, { useRef, useEffect, useState } from "react";
const FollowPage: React.FC = (props) => {
    const canvasRef = useRef();
    const [cropX, setCropX] = useState(0);
    const [cropY, setCropY] = useState(0);
    const [cropWidth, setCropWidth] = useState(0);
    const [cropHeight, setCropHeight] = useState(0);
    const [a, setA] = useState("");
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.crossOrigin = 'anonymous'
        image.src = 'http://localhost:5000/images/29322505_p0.jpg';
        // 获取Canvas元素
        // 获取Canvas的上下文
        // 获取图片元素
        // 计算缩放比例
        var scale = Math.min(canvas.width / image.width, canvas.height / image.height);
        // 绘制图片
        // ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
        // 获取裁剪后的图片数据
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        image.onload = () => {
            ctx.drawImage(image, 0, 0, image.width * scale, image.height * scale);
            // ctx.drawImage(image, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            // Do the cropping here
            ctx.putImageData(imageData, 0, 0);
            ctx.rect(cropX, cropY, cropWidth, cropHeight);
            ctx.stroke();
            setA(image);
        };
    }, [cropX, cropY, cropWidth, cropHeight]);
    return <div><canvas ref={canvasRef} width={200} height={150} />
    </div>


};

export default FollowPage;
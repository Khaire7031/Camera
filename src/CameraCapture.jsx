import React, { useRef, useState } from 'react';

const CameraCapture = () => {
    const [streaming, setStreaming] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const imageCount = useRef(1);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setStreaming(true);
            captureImage();
        } catch (err) {
            console.error('Error accessing camera:', err);
            alert('Unable to access camera. Please check your permissions.');
        }
    };

    const stopCamera = () => {
        const stream = videoRef.current.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        setStreaming(false);
    };

    const captureImage = () => {
        if (streaming) {
            const context = canvasRef.current.getContext('2d');
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const dataURL = canvasRef.current.toDataURL('image/png');
            downloadImage(dataURL, `src/images/${imageCount.current}.png`);
            imageCount.current += 1;
            setTimeout(captureImage, 1000);
        }
    };

    const downloadImage = (dataURL, filename) => {
        fetch(dataURL)
            .then(res => res.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
            });
    };

    return (
        <div className="flex flex-col items-center p-4">
            <video ref={videoRef} width="640" height="480" className="border border-gray-300 mb-4"></video>
            <canvas ref={canvasRef} width="640" height="480" className="hidden"></canvas>
            <div className="flex gap-4">
                <button
                    onClick={startCamera}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
                >
                    Start Camera
                </button>
                <button
                    onClick={stopCamera}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
                >
                    Stop Camera
                </button>
            </div>
        </div>
    );
};

export default CameraCapture;

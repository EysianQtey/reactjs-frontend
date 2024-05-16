import React, { useState, useEffect, useRef } from 'react';
import './PaintingCanvas.css'; // Import CSS for styling
import Button from 'react-bootstrap/Button';


const PaintingCanvas = () => {
    const [isPainting, setIsPainting] = useState(false);
    const [color, setColor] = useState('#000000'); // Default color is black
    const [lineWidth, setLineWidth] = useState(2); // Default line width
    const [prevX, setPrevX] = useState(0); // Previous X coordinate
    const [prevY, setPrevY] = useState(0); // Previous Y coordinate
    const [undoStack, setUndoStack] = useState([]); // Array to store previous canvas states
    const [redoStack, setRedoStack] = useState([]); // Array to store undone canvas states
    const [isErasing, setIsErasing] = useState(false); // Flag to indicate erasing mode
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const handleResize = () => {
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;
            // Fill with white color after resizing
            context.fillStyle = '#FFFFFF';
            context.fillRect(0, 0, canvas.width, canvas.height);
        };

        // Set initial canvas dimensions
        canvas.width = 800; // Set the width to 800px
        canvas.height = 430; // Set the height to 600px
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const startPaint = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        setIsPainting(true);
        setPrevX(offsetX);
        setPrevY(offsetY);
        canvas.style.cursor = 'crosshair'; // Change cursor to crosshair while painting
    };

    const endPaint = () => {
        setIsPainting(false);
        // Store current canvas state for undo
        setUndoStack([...undoStack, canvasRef.current.toDataURL()]);
        // Clear redo stack when a new action is performed
        setRedoStack([]);
        canvasRef.current.style.cursor = 'auto'; // Restore default cursor after painting
    };

    const draw = ({ nativeEvent }) => {
        if (!isPainting) return;
        const { offsetX, offsetY } = nativeEvent;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.lineCap = 'round'; // Rounded line ends
        context.lineWidth = isErasing ? 10 : lineWidth; // Adjust line width for erasing
        context.strokeStyle = isErasing ? '#FFFFFF' : color; // Set color for erasing or drawing
        context.beginPath();
        context.moveTo(prevX, prevY);
        context.lineTo(offsetX, offsetY);
        context.stroke();
        setPrevX(offsetX);
        setPrevY(offsetY);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Fill with white color after clearing
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
        // Clear undo and redo stacks
        setUndoStack([]);
        setRedoStack([]);
    };

    const handleColorChange = (e) => {
        setColor(e.target.value);
    };

    const handleLineWidthChange = (e) => {
        setLineWidth(parseInt(e.target.value));
    };

    const saveImage = () => {
        const canvas = canvasRef.current;
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'painting.png';
        link.click();
    };

    const undo = () => {
        if (undoStack.length === 0) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (undoStack.length === 1) { // If only initial state is present
            context.clearRect(0, 0, canvas.width, canvas.height);
            setRedoStack([undoStack.pop(), ...redoStack]);
            setUndoStack([]);
        } else {
            const lastState = undoStack.pop();
            setRedoStack([lastState, ...redoStack]);
            const img = new Image();
            img.src = undoStack[undoStack.length - 1];
            img.onload = () => {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0);
            };
        }
    };

    const redo = () => {
        if (redoStack.length === 0) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const lastState = redoStack.pop();
        setUndoStack([...undoStack, canvas.toDataURL()]);
        const img = new Image();
        img.src = lastState;
        img.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0);
        };
    };

    return (
        <div className="painting-canvas">
            <canvas
                ref={canvasRef}
                onMouseDown={startPaint}
                onMouseUp={endPaint}
                onMouseMove={draw}
            />
            <div className="controls">
            <div className="back-button">
                <Button variant="secondary" className="mt-2 me-2" size="lg" onClick={() => window.history.back()}>
                    Back
                </Button>
            </div>
                <input type="color" value={color} onChange={handleColorChange} />
                <input type="range" min="1" max="20" value={lineWidth} onChange={handleLineWidthChange} />
                <button onClick={clearCanvas}>Clear</button>
                <button onClick={undo}>Undo</button>
                <button onClick={redo}>Redo</button>
                <button onClick={() => setIsErasing(!isErasing)}> {isErasing ? 'Disable Erasing' : 'Enable Erasing'}</button>
                <button onClick={saveImage}>Save</button>
            </div>
        </div>
    );
};

export default PaintingCanvas;

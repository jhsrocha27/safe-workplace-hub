import { useRef, useState, useEffect } from 'react';

interface UseSignatureCanvasReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  startDrawing: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  draw: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  stopDrawing: () => void;
  clearSignature: () => void;
  saveSignature: () => string | null;
  showSuccessFeedback: () => void;
}

export function useSignatureCanvas(): UseSignatureCanvasReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        setContext(ctx);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    if (!context || !canvasRef.current) return;
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const saveSignature = (): string | null => {
    if (!canvasRef.current) return null;
    return canvasRef.current.toDataURL();
  };

  const showSuccessFeedback = () => {
    if (!canvasRef.current || !context) return;

    const canvas = canvasRef.current;
    const originalStrokeStyle = context.strokeStyle;
    const originalLineWidth = context.lineWidth;
    const originalData = context.getImageData(0, 0, canvas.width, canvas.height);

    context.strokeStyle = '#4CAF50';
    context.lineWidth = 3;
    context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

    setTimeout(() => {
      if (context) {
        context.strokeStyle = originalStrokeStyle;
        context.lineWidth = originalLineWidth;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.putImageData(originalData, 0, 0);
      }
    }, 800);
  };

  return {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    clearSignature,
    saveSignature,
    showSuccessFeedback
  };
}
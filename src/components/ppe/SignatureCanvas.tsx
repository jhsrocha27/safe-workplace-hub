import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface SignatureCanvasProps {
  onSave: (signatureData: string) => void;
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ onSave }) => {
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
    if (!context) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
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

  const saveSignature = () => {
    if (!canvasRef.current) return;
    const signatureData = canvasRef.current.toDataURL();
    onSave(signatureData);

    // Adiciona feedback visual para o usuário
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Salva o estilo original
      const originalStrokeStyle = ctx.strokeStyle;
      const originalLineWidth = ctx.lineWidth;

      // Aplica efeito visual de sucesso
      ctx.strokeStyle = '#4CAF50';
      ctx.lineWidth = 3;
      ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

      // Restaura o estilo original após o efeito
      setTimeout(() => {
        ctx.strokeStyle = originalStrokeStyle;
        ctx.lineWidth = originalLineWidth;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (context) {
          context.putImageData(context.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
        }
      }, 800);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <canvas
        ref={canvasRef}
        width={500}
        height={200}
        className="border-2 border-dashed border-gray-300 rounded-md cursor-crosshair bg-white"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={clearSignature}
          type="button"
        >
          Limpar
        </Button>
        <Button
          onClick={saveSignature}
          type="button"
          className="bg-white hover:bg-white/90 text-black border border-gray-200"
        >
          Confirmar Assinatura
        </Button>
      </div>
    </div>
  );
};

export default SignatureCanvas;
import React, { useRef, useState, useEffect } from 'react';
import { Download, RotateCcw, CheckSquare, Square, Check, Sparkles } from 'lucide-react';

interface DigitalDrawingCanvasProps {
  drawingPrompt?: string;
  suggestedColors?: string[];
  criteriaChecklist?: string[];
  onArtworkDrawn?: () => void;
}

export const DigitalDrawingCanvas: React.FC<DigitalDrawingCanvasProps> = ({
  drawingPrompt = 'Sketch the core construction masses using geometric forms.',
  suggestedColors = ['#1c1917', '#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
  criteriaChecklist = [
    'Established primary geometric masses',
    'Maintained proportion guidelines',
    'Applied clear gesture lines',
  ],
  onArtworkDrawn,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState(suggestedColors[0] || '#1c1917');
  const [lineWidth, setLineWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [checkedCriteria, setCheckedCriteria] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set white background initially
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    onArtworkDrawn?.();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isEraser ? '#ffffff' : currentColor;
    ctx.lineWidth = isEraser ? lineWidth * 3 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `skillgarden-sketch-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const toggleCriterion = (idx: number) => {
    setCheckedCriteria((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-4">
      {/* Prompt banner */}
      <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-950 text-xs flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold uppercase tracking-wider block text-[10px] text-amber-800">
            Drawing Brief
          </span>
          <p className="mt-0.5 leading-relaxed font-medium">{drawingPrompt}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-stone-100 rounded-2xl border border-stone-200 text-xs">
        {/* Colors */}
        <div className="flex items-center gap-1.5">
          {suggestedColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => {
                setCurrentColor(color);
                setIsEraser(false);
              }}
              style={{ backgroundColor: color }}
              className={`w-6 h-6 rounded-full border-2 transition cursor-pointer ${
                !isEraser && currentColor === color ? 'border-stone-900 scale-110 shadow-sm' : 'border-white'
              }`}
            />
          ))}
          <button
            type="button"
            onClick={() => setIsEraser(!isEraser)}
            className={`px-2.5 py-1 rounded-xl font-bold transition cursor-pointer ${
              isEraser ? 'bg-stone-900 text-white' : 'bg-white hover:bg-stone-200 text-stone-700'
            }`}
          >
            {isEraser ? 'Eraser ON' : 'Eraser'}
          </button>
        </div>

        {/* Brush size */}
        <div className="flex items-center gap-2">
          <span className="text-stone-500 font-bold text-[11px]">Size</span>
          {[2, 4, 8].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setLineWidth(size)}
              className={`w-7 h-7 rounded-xl font-bold flex items-center justify-center transition cursor-pointer ${
                lineWidth === size ? 'bg-stone-900 text-white' : 'bg-white text-stone-700'
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearCanvas}
            className="p-1.5 rounded-xl bg-white hover:bg-stone-200 text-stone-600 transition cursor-pointer"
            title="Clear canvas"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={downloadCanvas}
            className="p-1.5 rounded-xl bg-white hover:bg-stone-200 text-stone-600 transition cursor-pointer"
            title="Save PNG"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-stone-200 shadow-inner bg-white relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={450}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full cursor-crosshair touch-none"
        />
        {!hasDrawn && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-stone-400 text-xs font-semibold">
            Draw directly on this digital canvas or sketch in your notebook
          </div>
        )}
      </div>

      {/* Self-Assessment Rubric Criteria */}
      {criteriaChecklist && criteriaChecklist.length > 0 && (
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5">
          <span className="text-xs font-extrabold uppercase tracking-wider text-stone-700 block">
            Self-Assessment Rubric Checklist
          </span>
          <div className="space-y-1.5">
            {criteriaChecklist.map((crit, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => toggleCriterion(idx)}
                className="w-full text-left flex items-start gap-2.5 text-xs text-stone-800 p-2 rounded-xl hover:bg-white transition cursor-pointer"
              >
                {checkedCriteria[idx] ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                )}
                <span className={checkedCriteria[idx] ? 'line-through text-stone-500' : 'font-medium'}>
                  {crit}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

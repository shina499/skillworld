import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';

interface ChessPieceOnSquare {
  square: string;
  piece: string;
}

interface ChessBoardPuzzleProps {
  instruction?: string;
  turn?: 'white' | 'black';
  initialPieces?: ChessPieceOnSquare[];
  solutionMove?: {
    from: string;
    to: string;
    description: string;
  };
  onSolved?: () => void;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export const ChessBoardPuzzle: React.FC<ChessBoardPuzzleProps> = ({
  instruction = 'White to move and win: find the decisive tactical sequence!',
  turn = 'white',
  initialPieces = [
    { square: 'g8', piece: '♚' },
    { square: 'f7', piece: '♟' },
    { square: 'g7', piece: '♟' },
    { square: 'h7', piece: '♟' },
    { square: 'e8', piece: '♜' },
    { square: 'g1', piece: '♔' },
    { square: 'f2', piece: '♙' },
    { square: 'g2', piece: '♙' },
    { square: 'h2', piece: '♙' },
    { square: 'd1', piece: '♖' },
  ],
  solutionMove = {
    from: 'd1',
    to: 'd8',
    description: '1. Rd8+! A devastating back-rank rook penetration forcing mate or massive material gain.',
  },
  onSolved,
}) => {
  const [pieces, setPieces] = useState<ChessPieceOnSquare[]>(initialPieces);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'idle' | 'success' | 'wrong'; message: string }>({
    type: 'idle',
    message: instruction,
  });
  const [isSolved, setIsSolved] = useState(false);

  const handleSquareClick = (square: string) => {
    if (isSolved) return;

    // If no square is selected, select if there is a piece belonging to the player's turn
    if (!selectedSquare) {
      const pieceOnSq = pieces.find((p) => p.square === square);
      if (pieceOnSq) {
        setSelectedSquare(square);
        setFeedback({
          type: 'idle',
          message: `Selected piece on ${square.toUpperCase()}. Now click destination square.`,
        });
      }
      return;
    }

    // A piece is already selected, this click is the destination
    if (selectedSquare === square) {
      // Deselect
      setSelectedSquare(null);
      setFeedback({ type: 'idle', message: instruction });
      return;
    }

    // Check if move matches solution
    if (selectedSquare === solutionMove.from && square === solutionMove.to) {
      // Correct move!
      const movingPiece = pieces.find((p) => p.square === selectedSquare);
      const remainingPieces = pieces.filter((p) => p.square !== square && p.square !== selectedSquare);
      if (movingPiece) {
        setPieces([...remainingPieces, { square, piece: movingPiece.piece }]);
      }
      setIsSolved(true);
      setSelectedSquare(null);
      setFeedback({
        type: 'success',
        message: `✓ Brilliant move! ${solutionMove.description}`,
      });
      onSolved?.();
    } else {
      // Ineffective move
      setSelectedSquare(null);
      setFeedback({
        type: 'wrong',
        message: `That move is playable, but there is a sharper, winning tactical blow! Try again.`,
      });
    }
  };

  const handleReset = () => {
    setPieces(initialPieces);
    setSelectedSquare(null);
    setIsSolved(false);
    setFeedback({ type: 'idle', message: instruction });
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">♟️</span>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Tactical Position • {turn === 'white' ? 'White to move' : 'Black to move'}
            </div>
            <div className="text-xs text-stone-400 font-medium">Click a piece, then click target square</div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition cursor-pointer"
          title="Reset board"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 8x8 Chessboard */}
      <div className="w-full max-w-[340px] mx-auto aspect-square rounded-xl overflow-hidden border-2 border-stone-700 shadow-xl grid grid-cols-8 grid-rows-8 bg-amber-100 select-none">
        {RANKS.map((rank, rIdx) =>
          FILES.map((file, fIdx) => {
            const square = `${file}${rank}`;
            const isDark = (rIdx + fIdx) % 2 === 1;
            const pieceObj = pieces.find((p) => p.square === square);
            const isSelected = selectedSquare === square;
            const isTarget = isSolved && square === solutionMove.to;

            let bgClass = isDark ? 'bg-amber-800' : 'bg-amber-100';
            if (isSelected) {
              bgClass = 'bg-emerald-400 ring-2 ring-emerald-600 ring-inset';
            } else if (isTarget) {
              bgClass = 'bg-emerald-500 text-white animate-pulse';
            }

            return (
              <button
                key={square}
                type="button"
                onClick={() => handleSquareClick(square)}
                className={`relative flex items-center justify-center font-serif cursor-pointer transition ${bgClass} hover:opacity-90 active:scale-95`}
                style={{ fontSize: '1.6rem' }}
                title={square}
              >
                {/* Square coordinate text in corners */}
                {fIdx === 0 && (
                  <span className={`absolute top-0.5 left-0.5 text-[9px] font-mono leading-none ${isDark ? 'text-amber-300/60' : 'text-amber-900/60'}`}>
                    {rank}
                  </span>
                )}
                {rIdx === 7 && (
                  <span className={`absolute bottom-0.5 right-0.5 text-[9px] font-mono leading-none ${isDark ? 'text-amber-300/60' : 'text-amber-900/60'}`}>
                    {file}
                  </span>
                )}

                {/* Chess piece glyph */}
                {pieceObj && (
                  <span className={`drop-shadow-sm select-none ${pieceObj.piece === '♔' || pieceObj.piece === '♖' || pieceObj.piece === '♙' || pieceObj.piece === '♕' ? 'text-stone-100' : 'text-stone-950'}`}>
                    {pieceObj.piece}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Move Feedback */}
      <div
        className={`p-3 rounded-xl text-xs flex items-start gap-2.5 transition ${
          feedback.type === 'success'
            ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-200 font-bold'
            : feedback.type === 'wrong'
            ? 'bg-rose-950/80 border border-rose-500 text-rose-200'
            : 'bg-stone-800 text-stone-300'
        }`}
      >
        {feedback.type === 'success' ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        ) : feedback.type === 'wrong' ? (
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        ) : (
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        )}
        <div className="leading-relaxed">{feedback.message}</div>
      </div>
    </div>
  );
};

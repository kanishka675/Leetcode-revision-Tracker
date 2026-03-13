import { useState } from 'react';
import { motion } from 'framer-motion';

export default function DPGridVisualizer() {
    const rows = 3;
    const cols = 4;
    const [grid, setGrid] = useState(Array(rows).fill(0).map(() => Array(cols).fill(0)));
    const [status, setStatus] = useState('Wait');
    const [currRow, setCurrRow] = useState(0);
    const [currCol, setCurrCol] = useState(0);

    const handleNext = () => {
        if (status === 'Wait') {
            setStatus('Running');
            const newGrid = [...grid];
            newGrid[0][0] = 1;
            setGrid(newGrid);
            setCurrRow(0);
            setCurrCol(1);
            return;
        }

        if (currRow >= rows) {
            setStatus('Over');
            return;
        }

        const newGrid = grid.map(r => [...r]);
        
        // Base cases: first row or first column
        if (currRow === 0 || currCol === 0) {
            newGrid[currRow][currCol] = 1;
        } else {
            // dp[i][j] = dp[i-1][j] + dp[i][j-1]
            newGrid[currRow][currCol] = newGrid[currRow - 1][currCol] + newGrid[currRow][currCol - 1];
        }

        setGrid(newGrid);

        // Move to next cell
        let nextCol = currCol + 1;
        let nextRow = currRow;
        if (nextCol >= cols) {
            nextCol = 0;
            nextRow = currRow + 1;
        }

        setCurrRow(nextRow);
        setCurrCol(nextCol);
        if (nextRow >= rows) setStatus('Over');
    };

    const reset = () => {
        setGrid(Array(rows).fill(0).map(() => Array(cols).fill(0)));
        setStatus('Wait');
        setCurrRow(0);
        setCurrCol(0);
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
            <div className="text-center space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Unique Paths (Grid DP)</p>
                <p className="text-sm text-slate-400">
                    {status === 'Wait' ? 'Calculate total paths from (0,0) to (2,3)' : 
                     status === 'Over' ? `Total unique paths: ${grid[rows-1][cols-1]}` : 
                     `Filling cell (${currRow}, ${currCol})`}
                </p>
            </div>

            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                {grid.map((row, r) => 
                    row.map((val, c) => {
                        const isCurrent = r === currRow && c === currCol;
                        const isFilled = val > 0;
                        const isLast = r === rows-1 && c === cols-1;

                        return (
                            <motion.div
                                key={`${r}-${c}`}
                                animate={{
                                    scale: isCurrent ? 1.1 : 1,
                                    borderColor: isCurrent ? '#0ea5e9' : isLast && status === 'Over' ? '#10b981' : 'rgba(255,255,255,0.1)',
                                    backgroundColor: isCurrent ? 'rgba(14, 165, 233, 0.2)' : isFilled ? 'rgba(14, 165, 233, 0.1)' : 'rgba(31, 41, 55, 0.5)'
                                }}
                                className="w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center font-black text-slate-200"
                            >
                                <span className="text-lg">{val}</span>
                                <span className="text-[8px] text-slate-500">({r},{c})</span>
                            </motion.div>
                        );
                    })
                )}
            </div>

            <div className="flex gap-4">
                <button onClick={handleNext} disabled={status === 'Over'} className="btn-primary px-8">
                    {status === 'Wait' ? 'Start' : 'Next Step'}
                </button>
                <button onClick={reset} className="btn-secondary px-8">Reset</button>
            </div>
            
            <div className="text-[10px] text-slate-500 max-w-sm text-center">
                DP State: <code className="text-brand-400">dp[i][j] = dp[i-1][j] + dp[i][j-1]</code>. We sum paths from top and left neighbors.
            </div>
        </div>
    );
}

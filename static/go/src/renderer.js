import { CELL_SIZE, BOARD_SIZE, COLORS, PLAYERS, STAR_POINTS } from './config.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scale = 1;
    }

    setScale(scale) {
        this.scale = scale;
    }

    clear() {
        this.ctx.fillStyle = COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBoard() {
        // 所有坐标都乘以缩放比例
        const scaledCellSize = CELL_SIZE * this.scale;
        const padding = scaledCellSize;
        const boardWidth = (BOARD_SIZE - 1) * scaledCellSize;

        this.ctx.fillStyle = COLORS.BOARD;
        this.ctx.fillRect(
            padding - scaledCellSize / 2,
            padding - scaledCellSize / 2,
            boardWidth + scaledCellSize,
            boardWidth + scaledCellSize
        );

        this.ctx.strokeStyle = COLORS.LINE;
        this.ctx.lineWidth = Math.max(1, this.scale);

        for (let i = 0; i < BOARD_SIZE; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(padding, padding + i * scaledCellSize);
            this.ctx.lineTo(padding + boardWidth, padding + i * scaledCellSize);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(padding + i * scaledCellSize, padding);
            this.ctx.lineTo(padding + i * scaledCellSize, padding + boardWidth);
            this.ctx.stroke();
        }

        this.ctx.fillStyle = COLORS.STAR_POINT;
        const starPointRadius = Math.max(3, 4 * this.scale);
        for (const [row, col] of STAR_POINTS) {
            this.ctx.beginPath();
            this.ctx.arc(
                padding + col * scaledCellSize,
                padding + row * scaledCellSize,
                starPointRadius,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        }
    }

    drawStones(board) {
        const scaledCellSize = CELL_SIZE * this.scale;
        const padding = scaledCellSize;

        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                const stone = board.get(row, col);
                if (stone) {
                    this._drawStone(
                        padding + col * scaledCellSize,
                        padding + row * scaledCellSize,
                        stone
                    );
                }
            }
        }
    }

    _drawStone(x, y, player) {
        const scaledCellSize = CELL_SIZE * this.scale;
        const radius = scaledCellSize / 2 - 2 * this.scale;
        const gradientOffset = 5 * this.scale;

        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);

        if (player === PLAYERS.BLACK) {
            const gradient = this.ctx.createRadialGradient(
                x - gradientOffset, y - gradientOffset, 0,
                x, y, radius
            );
            gradient.addColorStop(0, '#666666');
            gradient.addColorStop(1, '#000000');
            this.ctx.fillStyle = gradient;
        } else {
            const gradient = this.ctx.createRadialGradient(
                x - gradientOffset, y - gradientOffset, 0,
                x, y, radius
            );
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(1, '#cccccc');
            this.ctx.fillStyle = gradient;
        }

        this.ctx.fill();
        this.ctx.strokeStyle = player === PLAYERS.BLACK ? '#000000' : '#999999';
        this.ctx.lineWidth = Math.max(1, this.scale);
        this.ctx.stroke();
    }

    drawLastMove(row, col) {
        const scaledCellSize = CELL_SIZE * this.scale;
        const padding = scaledCellSize;
        const x = padding + col * scaledCellSize;
        const y = padding + row * scaledCellSize;

        const sampleSize = Math.max(10, 20 * this.scale);
        const stone = this.ctx.getImageData(x - sampleSize / 2, y - sampleSize / 2, sampleSize, sampleSize);
        const isBlack = stone.data[0] < 128;

        this.ctx.strokeStyle = isBlack ? '#ffffff' : '#000000';
        this.ctx.lineWidth = Math.max(1, 2 * this.scale);
        this.ctx.beginPath();
        this.ctx.arc(x, y, Math.max(3, 5 * this.scale), 0, Math.PI * 2);
        this.ctx.stroke();
    }

    drawStatus(currentPlayer, state, captures) {
        const scaledCellSize = CELL_SIZE * this.scale;
        const boardWidth = (BOARD_SIZE - 1) * scaledCellSize;
        const statusY = scaledCellSize + boardWidth + scaledCellSize / 2 + 20 * this.scale;

        this.ctx.fillStyle = COLORS.TEXT;
        this.ctx.font = `bold ${Math.max(12, 18 * this.scale)}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        if (state === 'game_over') {
            this.ctx.fillText('双方连续弃权，游戏结束', this.canvas.width / 2, statusY);
        } else {
            const text = currentPlayer === PLAYERS.BLACK ? '黑棋走子' : '白棋走子';
            this.ctx.fillText(text, this.canvas.width / 2, statusY);
        }

        this.ctx.font = `${Math.max(10, 14 * this.scale)}px Arial`;
        this.ctx.fillText(
            `提子 - 黑: ${captures.black} | 白: ${captures.white}`,
            this.canvas.width / 2,
            statusY + 22 * this.scale
        );

        this.ctx.font = `${Math.max(8, 12 * this.scale)}px Arial`;
        this.ctx.fillText(
            '按 P 弃权 | 按 U 悔棋 | 按 R 重新开始',
            this.canvas.width / 2,
            statusY + 44 * this.scale
        );
    }
}

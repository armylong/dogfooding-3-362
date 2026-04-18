import { Game } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);

    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        game.handleClick(x, y);
    });

    document.addEventListener('keydown', (event) => {
        if (event.code === 'KeyR') {
            game.restart();
        }
        if (event.code === 'KeyP') {
            game.pass();
        }
        if (event.code === 'KeyU') {
            game.undo();
        }
    });

    // 窗口大小变化时重新计算缩放并重绘
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // 防抖处理，避免频繁调用
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            game.resize();
            game._render();
        }, 100);
    });
});

// script.js

document.addEventListener('DOMContentLoaded', function() {
    // ===== 1. Подсветка активного пункта меню =====
    const currentLocation = location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentLocation) {
            link.classList.add('active');
        }
    });

    // ===== 2. Код для страницы "Секретный код" =====
    if (document.getElementById('codeDisplay')) {
        initSecretCode();
    }
});

// Функция, инициализирующая все анимации на code.html
function initSecretCode() {
    // Код, который будет печататься
    const codeLines = [
        "function createHeart() {",
        "  const love = 'Для тебя ❤️';",
        "  const memory = new Date('2023-06-14');",
        "  const status = 'влюблён';",
        "  ",
        "  while(true) {",
        "    console.log('Я тебя люблю');",
        "    // Бесконечный цикл счастья",
        "  }",
        "}",
        "",
        "createHeart();"
    ];

    let currentLine = 0;
    let currentChar = 0;
    let typingInterval;
    let countdownInterval;
    
    const codeDisplay = document.getElementById('codeDisplay');
    const countdownDisplay = document.getElementById('countdownDisplay');
    const heartContainer = document.getElementById('heartContainer');
    const heartCanvas = document.getElementById('heartCanvas');
    const finalMessage = document.getElementById('finalMessage');
    const stageIndicator = document.getElementById('stageIndicator');
    const restartBtn = document.getElementById('restartBtn');

    // Типаем код
    function typeCode() {
        stageIndicator.innerHTML = '📟 Компиляция...';
        
        if (currentLine < codeLines.length) {
            if (currentChar === 0) {
                const lineDiv = document.createElement('div');
                lineDiv.className = 'code-line typing';
                lineDiv.id = `line-${currentLine}`;
                codeDisplay.appendChild(lineDiv);
            }
            
            const lineElement = document.getElementById(`line-${currentLine}`);
            const line = codeLines[currentLine];
            
            if (currentChar < line.length) {
                lineElement.innerHTML += line[currentChar];
                currentChar++;
            } else {
                lineElement.classList.remove('typing');
                currentLine++;
                currentChar = 0;
            }
        } else {
            // Код написан — запускаем отсчёт
            clearInterval(typingInterval);
            stageIndicator.innerHTML = '✅ Компиляция завершена';
            setTimeout(startCountdown, 1000);
        }
    }

    // Отсчёт 3...2...1...
    function startCountdown() {
        stageIndicator.innerHTML = '⏳ Запуск программы...';
        codeDisplay.parentElement.style.opacity = '0.5';
        
        let count = 3;
        countdownDisplay.classList.remove('hidden');
        
        countdownInterval = setInterval(() => {
            countdownDisplay.innerHTML = count;
            
            if (count === 0) {
                clearInterval(countdownInterval);
                countdownDisplay.classList.add('hidden');
                startDrawingHeart();
            }
            count--;
        }, 1000);
    }

    // Рисуем сердце постепенно
    function startDrawingHeart() {
        stageIndicator.innerHTML = '❤️ Рисую сердце...';
        heartContainer.classList.remove('hidden');
        
        const ctx = heartCanvas.getContext('2d');
        const width = heartCanvas.width;
        const height = heartCanvas.height;
        
        let frame = 0;
        const totalFrames = 180;      // Увеличено для более длительной анимации
        
        function drawHeart(progress) {
            ctx.clearRect(0, 0, width, height);
            
            // Фон
            ctx.fillStyle = '#0a0c0e';
            ctx.fillRect(0, 0, width, height);
            
            // Рисуем сердце по точкам
            ctx.save();
            ctx.translate(width/2, height/2 - 20);
            ctx.scale(2, 2);
            
            ctx.beginPath();
            ctx.strokeStyle = '#ff4757';
            ctx.lineWidth = 3;
            
            // Уравнение сердца
            for (let t = 0; t <= progress * Math.PI * 2; t += 0.05) {
                const x = 16 * Math.pow(Math.sin(t), 3);
                const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
                
                if (t === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
            
            // Внутренняя заливка (постепенная)
            if (progress > 0.8) {
                ctx.fillStyle = 'rgba(255, 71, 87, ' + ((progress - 0.8) * 5) + ')';
                ctx.fill();
            }
            
            ctx.restore();
            
            // Подпись
            ctx.font = '14px "Courier New", monospace';
            ctx.fillStyle = '#b2bec3';
            ctx.textAlign = 'center';
            ctx.fillText('for (let day = 0; day < forever; day++)', width/2, height - 30);
            ctx.fillStyle = '#ffb8b8';
            ctx.fillText('{ love++; }', width/2, height - 10);
        }
        
        function animateHeart() {
            const progress = frame / totalFrames;
            drawHeart(Math.min(progress, 1));
            
            if (progress < 1) {
                frame++;
                requestAnimationFrame(animateHeart);
            } else {
                // Сердце готово — показываем сообщение и запускаем пульсацию
                finalMessage.classList.remove('hidden');
                finalMessage.innerHTML = '❤️ LOVE ❤️';
                stageIndicator.innerHTML = '❤️ Программа выполнена успешно';
                restartBtn.classList.remove('hidden');
                
                // Запускаем пульсацию сердца
                startPulsingHeart(ctx, width, height);
            }
        }
        
        animateHeart();
    }

    // Пульсация сердца (после завершения рисования)
    function startPulsingHeart(ctx, width, height) {
        let time = 0;
        
        function pulse() {
            // Коэффициент пульсации: изменяется от 0.95 до 1.05 с частотой ~2 Гц
            const scale = 0.95 + 0.05 * Math.sin(time * 0.02);
            
            ctx.clearRect(0, 0, width, height);
            
            // Фон
            ctx.fillStyle = '#0a0c0e';
            ctx.fillRect(0, 0, width, height);
            
            // Рисуем сердце с масштабированием
            ctx.save();
            ctx.translate(width/2, height/2 - 20);
            ctx.scale(2 * scale, 2 * scale);   // применяем пульсацию
            
            ctx.beginPath();
            ctx.strokeStyle = '#ff4757';
            ctx.lineWidth = 3 / scale;          // корректируем толщину линии
            
            for (let t = 0; t <= Math.PI * 2; t += 0.05) {
                const x = 16 * Math.pow(Math.sin(t), 3);
                const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
                
                if (t === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
            ctx.fillStyle = '#ff4757';
            ctx.fill();                          // заливаем полностью
            
            ctx.restore();
            
            // Подпись (пусть остаётся статичной)
            ctx.font = '14px "Courier New", monospace';
            ctx.fillStyle = '#b2bec3';
            ctx.textAlign = 'center';
            ctx.fillText('for (let day = 0; day < forever; day++)', width/2, height - 30);
            ctx.fillStyle = '#ffb8b8';
            ctx.fillText('{ love++; }', width/2, height - 10);
            
            time++;
            requestAnimationFrame(pulse);
        }
        
        pulse();
    }

    // Старт печати
    typingInterval = setInterval(typeCode, 100);
}

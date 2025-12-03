/* ==================== VARIABLES GLOBALES ==================== */
let points = [];
let currentRange = 10;

/* ==================== CONSTANTES MATEMÁTICAS ==================== */
const CONSTANTS = {
    // Constantes básicas
    'π': Math.PI,
    'pi': Math.PI,
    'e': Math.E,
    
    // Número áureo (phi)
    'φ': (1 + Math.sqrt(5)) / 2,
    'phi': (1 + Math.sqrt(5)) / 2,
    
    // Tau (2π)
    'τ': 2 * Math.PI,
    'tau': 2 * Math.PI,
    
    // Logaritmos naturales
    'ln2': Math.LN2,
    'ln10': Math.LN10,
    
    // Raíces cuadradas comunes
    '√2': Math.sqrt(2),
    '√3': Math.sqrt(3),
    '√5': Math.sqrt(5),
    '√7': Math.sqrt(7),
    '√8': Math.sqrt(8),
    '√10': Math.sqrt(10),
    '√11': Math.sqrt(11),
    '√12': Math.sqrt(12),
    '√13': Math.sqrt(13),
    '√15': Math.sqrt(15),
    '√17': Math.sqrt(17),
    '√19': Math.sqrt(19),
    '√20': Math.sqrt(20),
    
    // Raíces cuadradas negativas
    '-√2': -Math.sqrt(2),
    '-√3': -Math.sqrt(3),
    '-√5': -Math.sqrt(5)
};

console.log('Variables y constantes inicializadas correctamente');
 /* ==================== FUNCIÓN PARA PARSEAR NÚMEROS ==================== */
    function parseNumber(input) {
        input = input.trim().replace(/\s+/g, '');
        if (CONSTANTS.hasOwnProperty(input)) return CONSTANTS[input];

        let processedInput = input;
        for (const [symbol, value] of Object.entries(CONSTANTS)) {
            const regex = new RegExp(symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            processedInput = processedInput.replace(regex, value.toString());
        }

        // Fracciones simples
        if (input.includes('/') && !input.includes('*') && !input.includes('+') && !input.includes('-', 1)) {
            const parts = input.split('/');
            if (parts.length === 2) {
                const numerator = parseFloat(parts[0]);
                const denominator = parseFloat(parts[1]);
                if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) return numerator / denominator;
            }
        }

        // Raíces cuadradas
        if (input.startsWith('√') && !input.includes('*') && !input.includes('+') && !input.includes('-', 1)) {
            const radicand = parseFloat(input.slice(1));
            if (!isNaN(radicand) && radicand >= 0) return Math.sqrt(radicand);
        }
        if (input.startsWith('-√') && !input.includes('*') && !input.includes('+')) {
            const radicand = parseFloat(input.slice(2));
            if (!isNaN(radicand) && radicand >= 0) return -Math.sqrt(radicand);
        }

        if (input.includes('sqrt(')) {
            const match = input.match(/sqrt\(([^)]+)\)/);
            if (match) {
                const innerExpression = match[1];
                let innerValue;
                try {
                    if (innerExpression.includes('/') && !innerExpression.includes('*') && !innerExpression.includes('+') && !innerExpression.includes('-', 1)) {
                        const parts = innerExpression.split('/');
                        if (parts.length === 2) {
                            const num = parseFloat(parts[0]);
                            const den = parseFloat(parts[1]);
                            if (!isNaN(num) && !isNaN(den) && den !== 0) innerValue = num / den;
                        }
                    } else {
                        const safeChars = /^[0-9+\-*/.() ]+$/;
                        if (safeChars.test(innerExpression)) innerValue = Function('"use strict"; return (' + innerExpression + ')')();
                        else innerValue = parseFloat(innerExpression);
                    }
                    if (!isNaN(innerValue) && innerValue >= 0) return Math.sqrt(innerValue);
                } catch(e){}
            }
        }

        try {
            processedInput = processedInput.replace(/\^/g, '**');
            const safeChars = /^[0-9+\-*/.() ]+$/;
            if (safeChars.test(processedInput)) {
                const result = Function('"use strict"; return (' + processedInput + ')')();
                if (typeof result === 'number' && !isNaN(result) && isFinite(result)) return result;
            }
        } catch(e){}

        const num = parseFloat(processedInput);
        if (!isNaN(num)) return num;
        return null;
    }
    /* ==================== FUNCIONES DE CLASIFICACIÓN ==================== */
function classifyNumber(num, originalInput) {
    if (num > 0 && Number.isInteger(num)) return 'naturals';
    if (Number.isInteger(num)) return 'integers';

    const irrationalConstants = [
        'π', 'pi', 'e', 'φ', 'phi', 'τ', 'tau', 'ln2', 'ln10',  
        '√2', '√3', '√5', '√7', '√8', '√10', '√11', '√12', '√13', '√15', '√17', '√19', '√20',
        '-√2', '-√3', '-√5'
    ];

    if (irrationalConstants.includes(originalInput)) return 'irrationals';

    if (originalInput.includes('sqrt(')) {
        const sqrtMatch = originalInput.match(/sqrt\(([^)]+)\)/);
        if (sqrtMatch) {
            const innerExpression = sqrtMatch[1];
            let innerValue;
            try {
                if (innerExpression.includes('/')) {
                    const parts = innerExpression.split('/');
                    if (parts.length === 2) {
                        const num = parseFloat(parts[0]);
                        const den = parseFloat(parts[1]);
                        if (!isNaN(num) && !isNaN(den) && den !== 0) innerValue = num / den;
                    }
                } else {
                    innerValue = parseFloat(innerExpression);
                }
                if (!isNaN(innerValue) && innerValue >= 0) {
                    const sqrtResult = Math.sqrt(innerValue);
                    if (Number.isInteger(sqrtResult)) {
                        if (sqrtResult > 0) return 'naturals';
                        else if (sqrtResult === 0) return 'integers';
                    } else return 'irrationals';
                }
            } catch(e) { return 'irrationals'; }
        }
    }

    if (originalInput.includes('√')) return 'irrationals';

    if (originalInput.includes('*') || originalInput.includes('+') || originalInput.includes('-') || originalInput.includes('/')) {
        const irrationalSymbols = ['π', 'pi', 'e', 'φ', 'phi', 'τ', 'tau', 'ln2', 'ln10', '√', 'sqrt'];
        const containsIrrationals = irrationalSymbols.some(symbol => originalInput.includes(symbol));
        if (containsIrrationals) {
            const specialRationalCases = [
                /π\/π/, /pi\/pi/, /e\/e/, /φ\/φ/, /phi\/phi/, /τ\/τ/, /tau\/tau/,
                /√2\/√2/, /√3\/√3/, /√5\/√5/,
                /π-π/, /pi-pi/, /e-e/, /φ-φ/, /phi-phi/,
                /2\*π\/τ/, /τ\/2\*π/
            ];
            const isSpecialRational = specialRationalCases.some(pattern => pattern.test(originalInput.replace(/\s/g, '')));
            if (isSpecialRational) {
                if (num > 0 && Number.isInteger(num)) return 'naturals';
                if (Number.isInteger(num)) return 'integers';
                return 'rationals';
            }
            return 'irrationals';
        }
    }

    if (originalInput.includes('/')) return 'rationals';

    return 'rationals';
}

function getClassificationName(classification) {
    const names = {
        'naturals': 'ℕ (Naturales)',
        'integers': 'ℤ (Enteros)',
        'rationals': 'ℚ (Racionales)',
        'irrationals': 'ℝ-ℚ (Irracionales)'
    };
    return names[classification] || 'No clasificado';
}
/* ==================== FUNCIONES DE INTERFAZ DE USUARIO ==================== */
function addNumber() {
    const input = document.getElementById('numberInput').value;
    if (!input) { alert('Por favor ingresa un número'); return; }

    const value = parseNumber(input);
    if (value === null) { alert('Formato de número no válido. Ejemplos válidos: sqrt(7), 2*π, 1/e, √2, -1/2'); return; }

    if (Math.abs(value) > currentRange) {
        alert(`El número está fuera del rango actual (-${currentRange} a ${currentRange}).`);
        return;
    }

    const existingPoint = points.find(p => Math.abs(p.value - value) < 0.0001);
    if (existingPoint) { alert('Este número ya está en la recta numérica'); return; }

    const classification = classifyNumber(value, input);
    points.push({ value, originalInput: input, classification });

    document.getElementById('numberInput').value = '';
    updateDisplay();
    console.log(`Número agregado: ${input} = ${value} (${classification})`);
}

function addPresetNumber(input) {
    const value = parseNumber(input);
    if (value === null || Math.abs(value) > currentRange) { alert(`El número ${input} está fuera del rango`); return; }

    const existingPoint = points.find(p => Math.abs(p.value - value) < 0.0001);
    if (existingPoint) { alert('Este número ya está en la recta numérica'); return; }

    const classification = classifyNumber(value, input);
    points.push({ value, originalInput: input, classification });

    updateDisplay();
    console.log(`Número predefinido agregado: ${input} = ${value} (${classification})`);
}

function clearAll() {
    points = [];
    updateDisplay();
    console.log('Todos los puntos eliminados');
}

function updateDisplay() {
    drawNumberLine();
    updatePointsList();
    updateDistanceSelectors();
}
/* ==================== FUNCIONES DE VISUALIZACIÓN 
==================== */ 
function drawNumberLine() { 
    const numberLine = document.getElementById('numberLine'); 
    numberLine.innerHTML = ''; 
     
    // Crear la línea base de la recta 
    const line = document.createElement('div'); 
    line.className = 'line'; 
    numberLine.appendChild(line); 
     
    // Crear marcas de graduación 
    const tickCount = currentRange * 2 + 1; // De -range a +range 
    for (let i = 0; i < tickCount; i++) { 
        const value = -currentRange + i; 
        const percentage = (i / (tickCount - 1)) * 90 + 5; // 5% de margen a cada lado

        // Crear la marca vertical 
        const tick = document.createElement('div'); 
        tick.className = 'tick'; 
        tick.style.left = percentage + '%'; 
        numberLine.appendChild(tick); 
         
        // Crear la etiqueta numérica 
        const label = document.createElement('div'); 
        label.className = 'tick-label'; 
        label.style.left = percentage + '%'; 
        label.textContent = value; 
        numberLine.appendChild(label); 
    } 
     
    // Agregar los puntos de números agregados 
    points.forEach((point, index) => { 
 
 
 
        const percentage = ((point.value + currentRange) / (2 * 
currentRange)) * 90 + 5; 
         
        // Crear el elemento visual del punto 
        const pointElement = document.createElement('div'); 
        pointElement.className = `number-point 
${point.classification}`; 
        pointElement.style.left = percentage + '%'; 
        pointElement.draggable = false; 
         
        // Crear la etiqueta del punto 
        const pointLabel = document.createElement('div'); 
        pointLabel.className = 'point-label'; 
        pointLabel.textContent = `${point.originalInput} ≈ 
${point.value.toFixed(3)}`; 
        pointElement.appendChild(pointLabel); 
         
        // Agregar evento de clic para eliminar 
        pointElement.onclick = () => removePoint(index); 
        pointElement.title = `${point.originalInput} 
(${getClassificationName(point.classification)})\nHaz clic para 
eliminar`; 
         
        numberLine.appendChild(pointElement); 
    }); 
} 
 
function removePoint(index) { 
    if (confirm('¿Deseas eliminar este punto?')) { 
        const removedPoint = points.splice(index, 1)[0]; 
        updateDisplay(); 
        console.log(`Punto eliminado: 
${removedPoint.originalInput}`); 
    } 
} 
 
function updatePointsList() { 
    const pointsList = document.getElementById('pointsList'); 
     
 
 
 
    // Si no hay puntos, mostrar mensaje informativo 
    if (points.length === 0) { 
        pointsList.innerHTML = ` 
            <div class="empty-state"> 
                <p>Agrega números para ver su clasificación 
automática aquí</p> 
                <small>Los puntos aparecerán ordenados de menor a 
mayor</small> 
            </div> 
        `; 
        return; 
    } 
     
    // Ordenar puntos por valor de menor a mayor 
    const sortedPoints = [...points].sort((a, b) => a.value - 
b.value); 
     
    // Generar HTML para cada punto 
    pointsList.innerHTML = sortedPoints.map(point => ` 
        <div class="point-item" style="border-left: 4px solid 
${getClassificationColor(point.classification)}"> 
            <div> 
                <strong>${point.originalInput}</strong> ≈ 
${point.value.toFixed(6)} 
                <br> 
                
<small>${getClassificationName(point.classification)}</small> 
            </div> 
            <div style="text-align: right;"> 
                <small>Posición: ${point.value.toFixed(3)}</small> 
            </div> 
        </div> 
    `).join(''); 
} 
 
function getClassificationColor(classification) { 
    const colors = { 
        'naturals': '#e74c3c',    // Rojo 
        'integers': '#3498db',    // Azul   
 
'rationals': '#27ae60',   // Verde 
'irrationals': '#f1c40f'  // Amarillo 
}; 
return colors[classification] || '#95a5a6'; 
}
/* ==================== CALCULADORA DE DISTANCIAS 
==================== */ 
function updateDistanceSelectors() {
    const pointAItems = document.getElementById('pointA-items');
    const pointBItems = document.getElementById('pointB-items');
    const pointASelected = document.getElementById('pointA-selected');
    const pointBSelected = document.getElementById('pointB-selected');
    
    // Limpiar las opciones existentes
    pointAItems.innerHTML = '<div data-value="">Selecciona un punto</div>';
    pointBItems.innerHTML = '<div data-value="">Selecciona un punto</div>';
    
    if (points.length === 0) {
        pointASelected.textContent = 'Selecciona un punto';
        pointBSelected.textContent = 'Selecciona un punto';
        document.getElementById('pointA-container').setAttribute('data-value', '');
        document.getElementById('pointB-container').setAttribute('data-value', '');
        return;
    }

    points.forEach((point, index) => {
        const optionText = `${point.originalInput} (${point.value.toFixed(3)})`;

        const optionA = document.createElement('div');
        optionA.setAttribute('data-value', index);
        optionA.textContent = optionText;
        optionA.onclick = () => selectPoint('A', index, optionText);
        pointAItems.appendChild(optionA);

        const optionB = document.createElement('div');
        optionB.setAttribute('data-value', index);
        optionB.textContent = optionText;
        optionB.onclick = () => selectPoint('B', index, optionText);
        pointBItems.appendChild(optionB);
    });
}

function selectPoint(selector, index, text) {
    document.getElementById(`point${selector}-selected`).textContent = text;
    document.getElementById(`point${selector}-container`).setAttribute('data-value', index);
    document.getElementById(`point${selector}-items`).classList.remove('show');
}

function calculateDistance() {
    const pointAValue = document.getElementById('pointA-container').getAttribute('data-value');
    const pointBValue = document.getElementById('pointB-container').getAttribute('data-value');
    const resultDiv = document.getElementById('distanceResult');

    if (!pointAValue || !pointBValue) {
        resultDiv.innerHTML = '<div style="color: #dc3545; text-align: center; padding: 15px;">Selecciona ambos puntos para calcular la distancia</div>';
        return;
    }

    if (pointAValue === pointBValue) {
        resultDiv.innerHTML = '<div style="color: #dc3545; text-align: center; padding: 15px;">Selecciona dos puntos diferentes</div>';
        return;
    }

    const pointA = points[parseInt(pointAValue)];
    const pointB = points[parseInt(pointBValue)];
    const distance = Math.abs(pointA.value - pointB.value);

    resultDiv.innerHTML = `
        <div class="distance-result">
            <strong>Distancia entre ${pointA.originalInput} y ${pointB.originalInput}:</strong><br>
            <strong>d(a,b) = |${pointA.value.toFixed(3)} - ${pointB.value.toFixed(3)}| = ${distance.toFixed(6)} unidades</strong>
        </div>
    `;
    
    console.log(`Distancia calculada: |${pointA.value} - ${pointB.value}| = ${distance}`);
}

/* ==================== EVENT LISTENERS Y INICIALIZACIÓN 
==================== */ 
 
 
 
 
// Event listener para detectar Enter en el input de números 
document.getElementById('numberInput').addEventListener('keypress', 
function(e) { 
    if (e.key === 'Enter') { 
        addNumber(); 
    } 
}); 
 
// Event listeners para manejar los dropdowns personalizados 
document.getElementById('pointA-selected').onclick = function(e) { 
    e.stopPropagation(); 
    const items = document.getElementById('pointA-items'); 
    const isOpen = items.classList.contains('show'); 
     
    // Cerrar todos los dropdowns primero 
    document.querySelectorAll('.select-items').forEach(item => { 
        item.classList.remove('show'); 
    }); 
     
    // Alternar el estado del dropdown clickeado 
    if (!isOpen) { 
        items.classList.add('show'); 
    } 
}; 
 
document.getElementById('pointB-selected').onclick = function(e) { 
    e.stopPropagation(); 
    const items = document.getElementById('pointB-items'); 
    const isOpen = items.classList.contains('show'); 
     
    // Cerrar todos los dropdowns primero 
    document.querySelectorAll('.select-items').forEach(item => { 
        item.classList.remove('show'); 
    }); 
     
    // Alternar el estado del dropdown clickeado 
    if (!isOpen) { 
        items.classList.add('show'); 
    } 
 
}; 
// Cerrar dropdowns al hacer clic fuera de ellos 
document.addEventListener('click', function(e) { 
if (!e.target.closest('.custom-select')) { 
document.querySelectorAll('.select-items').forEach(item => { 
item.classList.remove('show'); 
}); 
} 
}); 
// Inicializar la aplicación 
console.log('Aplicación inicializada correctamente'); 
updateDisplay();
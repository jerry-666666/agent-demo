export type Color = [number, number, number];

export const COLORS: { [key: string]: Color[] } = {
  'color1': [[0, 0, 0], [0, 0, 5], [41, 10, 83], [57, 9, 98], [113, 26, 109], [169, 45, 93], [234, 103, 37], [250, 181, 26], [242, 225, 90], [252, 254, 165]],
  'color2': [[41, 10, 83], [113, 26, 109], [234, 103, 37], [250, 181, 26], [242, 225, 90]],
  'color3': [[234, 103, 37], [250, 181, 26], [242, 225, 90], [0, 0, 0], [0, 0, 5], [41, 10, 83]]
};

const randomOpacityChange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const drawPixelArt = (
  ctx: CanvasRenderingContext2D,
  type: string,
  size: number,
  pixelSize: number,
  initialColors: Color[][],
  alphaValues: number[][],
  colors: Color[],
  alpha: number,
  time: number
) => {
  const drawRandom = () => {
    const cols = Math.floor(ctx.canvas.width / pixelSize);
    const rows = Math.floor(ctx.canvas.height / pixelSize);
    
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const noise = (Math.sin(x * 0.1 + time) + Math.cos(y * 0.1 + time)) * 0.5;
        const colorIndex = Math.floor((noise + 1) * 0.5 * (colors.length - 1));
        const [r, g, b] = colors[colorIndex];
        
        const fadeAmount = randomOpacityChange(alpha, 255);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${fadeAmount / 255})`;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }
  };

  const drawVerticalArt = () => {
    const cols = Math.floor(ctx.canvas.width / pixelSize);
    const rows = Math.floor(ctx.canvas.height / pixelSize);
    const totalWidth = cols * pixelSize;
    const offset = (time * 50) % totalWidth;
    
    // Draw main pattern
    for (let i = -1; i <= cols + 1; i++) {
      if (!initialColors[i]) {
        initialColors[i] = [];
        alphaValues[i] = [];
      }
      for (let row = 0; row < rows; row++) {
        const col = i;
        const cx = (col * pixelSize - offset + totalWidth * 2) % totalWidth;
        const cy = row * pixelSize;
        
        if (!initialColors[i][row]) {
          const colorIndex = (col + 1) % colors.length;
          if ((Math.floor((col + 1) / colors.length)) % 2) {
            initialColors[i][row] = colors[colors.length - 1 - colorIndex];
          } else {
            initialColors[i][row] = colors[colorIndex];
          }
          alphaValues[i][row] = Math.random() * (255 - alpha) + alpha;
        }
        
        const [r, g, b] = initialColors[i][row];
        const fadeAmount = alphaValues[i][row];
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${fadeAmount / 255})`;
        ctx.fillRect(cx, cy, pixelSize, pixelSize);
        
        // Draw duplicate at the edge for smooth transition
        if (cx < pixelSize) {
          ctx.fillRect(cx + totalWidth, cy, pixelSize, pixelSize);
        } else if (cx > totalWidth - pixelSize) {
          ctx.fillRect(cx - totalWidth, cy, pixelSize, pixelSize);
        }
      }
    }
  };
  
  const drawRowArt = () => {
    const cols = Math.floor(ctx.canvas.width / pixelSize);
    const rows = Math.floor(ctx.canvas.height / pixelSize);
    const totalHeight = rows * pixelSize;
    const offset = (time * 50) % totalHeight;
    
    // Draw main pattern
    for (let i = -1; i <= rows + 1; i++) {
      if (!initialColors[i]) {
        initialColors[i] = [];
        alphaValues[i] = [];
      }
      for (let col = 0; col < cols; col++) {
        const row = i;
        const cx = col * pixelSize;
        const cy = (row * pixelSize - offset + totalHeight * 2) % totalHeight;
        
        if (!initialColors[i][col]) {
          const colorIndex = Math.abs(i % colors.length);
          if ((Math.floor(Math.abs(i) / colors.length)) % 2) {
            initialColors[i][col] = colors[colors.length - 1 - colorIndex];
          } else {
            initialColors[i][col] = colors[colorIndex];
          }
          alphaValues[i][col] = Math.random() * (255 - alpha) + alpha;
        }
        
        const [r, g, b] = initialColors[i][col] || colors[0];
        const fadeAmount = alphaValues[i][col] || alpha;
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${fadeAmount / 255})`;
        ctx.fillRect(cx, cy, pixelSize, pixelSize);
        
        // Draw duplicate at the edge for smooth transition
        if (cy < pixelSize) {
          ctx.fillRect(cx, cy + totalHeight, pixelSize, pixelSize);
        } else if (cy > totalHeight - pixelSize) {
          ctx.fillRect(cx, cy - totalHeight, pixelSize, pixelSize);
        }
      }
    }
  };
  

  
  
  const drawDiamondArt = () => {
    const rows = 3;
    const cols = 3;
    const offset = (Math.sin(time) * 50);
    drawMultipleDiamonds(rows, cols, size, colors, pixelSize, offset);
  };

  const drawMultipleDiamonds = (rows: number, cols: number, size: number, colorPalette: Color[], pixelSize: number, offset: number) => {
    const spacing = size * 0.9;
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = centerX + (col - 1) * spacing + offset;
        const y = centerY + (row - 1) * spacing + offset;
        drawDiamond(x, y, size, colorPalette, pixelSize);
      }
    }
  };

  const drawDiamond = (x: number, y: number, size: number, colorPalette: Color[], pixelSize: number) => {
    const halfSize = size / 2;
    const outerHalfSize = halfSize + pixelSize;
    
    let _alpha = Math.random() * (255 - alpha) + alpha;
    for (let i = -outerHalfSize; i < outerHalfSize; i += pixelSize) {
      for (let j = -outerHalfSize; j < outerHalfSize; j += pixelSize) {
        if (Math.abs(i) + Math.abs(j) <= outerHalfSize) {
          const distance = Math.abs(i) + Math.abs(j);
          if (distance <= outerHalfSize) {
            const colorIndex = Math.floor((distance / outerHalfSize) * (colorPalette.length - 1));
            const [r, g, b] = colorPalette[colorIndex];
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha / 255})`;
            ctx.fillRect(x + i, y + j, pixelSize, pixelSize);
          }
        }
      }
    }

    for (let i = -halfSize; i < halfSize; i += pixelSize) {
      for (let j = -halfSize; j < halfSize; j += pixelSize) {
        if (Math.abs(i) + Math.abs(j) <= halfSize) {
          let distance = Math.abs(i) + Math.abs(j);
          
          if (distance <= halfSize) {
            _alpha = 255;
            if (distance > 40) {
              _alpha = Math.random() * (255 - alpha) + alpha;
            } 
            distance = Math.max(distance - 30, 0);
            const colorIndex = Math.floor((distance / halfSize) * (colorPalette.length - 1));
            const [r, g, b] = colorPalette[colorIndex];
            
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${_alpha / 255})`;
            ctx.fillRect(x + i, y + j, pixelSize, pixelSize);
          }
        }
      }
    }
  };

  const drawCircleArt = () => {
    const rows = 3;
    const cols = 3;
    const offset = (Math.sin(time) * 50);
    drawMultipleCircles(rows, cols, size, colors, pixelSize, offset);
  };

  const drawMultipleCircles = (rows: number, cols: number, size: number, colorPalette: Color[], pixelSize: number, offset: number) => {
    const spacing = size * 1;
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = centerX + (col - 1) * spacing + offset;
        const y = centerY + (row - 1) * spacing + offset;
        drawCircle(x, y, size, colorPalette, pixelSize);
      }
    }
  };

  const drawCircle = (x: number, y: number, size: number, colorPalette: Color[], pixelSize: number) => {
    const halfSize = size / 2;
    const outerHalfSize = halfSize + pixelSize;
    
    let _alpha = Math.random() * (255 - alpha) + alpha;
    
    for (let i = -outerHalfSize; i < outerHalfSize; i += pixelSize) {
      for (let j = -outerHalfSize; j < outerHalfSize; j += pixelSize) {
        const distance = Math.sqrt(i * i + j * j);
        if (distance <= outerHalfSize) {
          const colorIndex = Math.floor((distance / outerHalfSize) * (colorPalette.length - 1));
          const [r, g, b] = colorPalette[colorIndex];
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${_alpha / 255})`;
          ctx.fillRect(x + i, y + j, pixelSize, pixelSize);
        }
      }
    }
    
    for (let i = -halfSize; i < halfSize; i += pixelSize) {
      for (let j = -halfSize; j < halfSize; j += pixelSize) {
        let distance = Math.sqrt(i * i + j * j);
        if (distance <= halfSize) {
          _alpha = 255;
          if (distance > 40) {
            _alpha = Math.random() * (255 - alpha) + alpha;
          }
          
          distance = Math.max(distance - 30, 0);
          const colorIndex = Math.floor((distance / halfSize) * (colorPalette.length - 1));
          const [r, g, b] = colorPalette[colorIndex];
          
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${_alpha / 255})`;
          ctx.fillRect(x + i, y + j, pixelSize, pixelSize);
        }
      }
    }
  };

  const drawSquareArt = () => {
    const rows = 3;
    const cols = 3;
    const offset = (Math.sin(time) * 50);
    drawMultipleSquares(rows, cols, size, colors, pixelSize, offset);
  };

  const drawMultipleSquares = (rows: number, cols: number, size: number, colorPalette: Color[], pixelSize: number, offset: number) => {
    const spacing = size * 1;
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = centerX + (col - 1) * spacing + offset;
        const y = centerY + (row - 1) * spacing + offset;
        drawSquare(x, y, size, colorPalette, pixelSize);
      }
    }
  };

  const drawSquare = (x: number, y: number, size: number, colorPalette: Color[], pixelSize: number) => {
    const halfSize = size / 2;
    const outerHalfSize = halfSize + pixelSize;
    
    let _alpha = Math.random() * (155) + 100;
    
    for (let i = -outerHalfSize; i < outerHalfSize; i += pixelSize) {
      for (let j = -outerHalfSize; j < outerHalfSize; j += pixelSize) {
        if (isInSquare(i, j, halfSize)) {
          const distance = Math.max(Math.abs(i), Math.abs(j));
          const colorIndex = Math.floor((distance / outerHalfSize) * (colorPalette.length - 1));
          const [r, g, b] = colorPalette[colorIndex];

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${_alpha / 255})`;
          ctx.fillRect(x + i, y + j, pixelSize, pixelSize);
        }
      }
    }
    
    for (let i = -halfSize; i < halfSize; i += pixelSize) {
      for (let j = -halfSize; j < halfSize; j += pixelSize) {
        if (isInSquare(i, j, halfSize)) {
          _alpha = 255;
          if (Math.abs(i) > 40) {
            _alpha = Math.random() * (155) + 100;
          }
          
          const distance = Math.max(Math.abs(i), Math.abs(j));
          const colorIndex = Math.floor((distance / halfSize) * (colorPalette.length - 1));
          const [r, g, b] = colorPalette[colorIndex];
          
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${_alpha / 255})`;
          ctx.fillRect(x + i, y + j, pixelSize, pixelSize);
        }
      }
    }
  };

  const isInSquare = (i: number, j: number, halfSize: number) => {
    return Math.abs(i) <= halfSize && Math.abs(j) <= halfSize;
  };

  const artTypes: { [key: string]: () => void } = {
    random: drawRandom,
    'vertical-line': drawVerticalArt,
    'row-line': drawRowArt,
    diamond: drawDiamondArt,
    'circle': drawCircleArt,
    'square': drawSquareArt
  };

  const artMethod = artTypes[type];
  if (artMethod) {
    artMethod();
  } else {
    console.error(`Unsupported styleType: ${type}`);
  }
};


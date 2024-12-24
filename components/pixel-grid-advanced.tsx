"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PixelGridProps {
  width?: number;
  height?: number;
  initialColor?: { r: number; g: number; b: number };
  secondaryColor?: { r: number; g: number; b: number };
  variance?: number;
}

type AnimationType =
  | "wave"
  | "ripple"
  | "stripes"
  | "dots"
  | "vortex"
  | "pulse"
  | "checkerboard"
  | "pixelWave";

export default function PixelGridAdvanced({
  width = 400,
  height = 400,
  initialColor = { r: 75, g: 0, b: 130 }, // Deep purple
  secondaryColor = { r: 255, g: 200, b: 0 }, // Yellow
  variance = 30,
}: PixelGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cellSize, setCellSize] = useState(40);
  const [colorVariance, setColorVariance] = useState(variance);
  const [baseColor, setBaseColor] = useState(initialColor);
  const [secondColor, setSecondColor] = useState(secondaryColor);
  const [animationType, setAnimationType] = useState<AnimationType>("wave");
  const [isAnimating, setIsAnimating] = useState(true);
  const frameRef = useRef<number>(null);

  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cols = Math.ceil(width / cellSize);
    const rows = Math.ceil(height / cellSize);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const time = Date.now() / 1000;

    // Draw pixels with animation
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        let color: { r: number; g: number; b: number };

        switch (animationType) {
          case "stripes":
            {
              const frequency = 0.6;
              const phase = time;
              const t = (Math.sin(x * frequency + phase) + 1) / 2;
              color = {
                r: baseColor.r + (secondColor.r - baseColor.r) * t,
                g: baseColor.g + (secondColor.g - baseColor.g) * t,
                b: baseColor.b + (secondColor.b - baseColor.b) * t,
              };
            }
            break;

          case "dots":
            {
              const centerX = x - Math.floor(cols / 2);
              const centerY = y - Math.floor(rows / 2);
              const distance = Math.sqrt(centerX * centerX + centerY * centerY);
              const pattern = Math.sin(distance * 0.4 - time * 0.8);
              const t = (pattern + 1) / 2;
              color = {
                r: baseColor.r + (secondColor.r - baseColor.r) * t,
                g: baseColor.g + (secondColor.g - baseColor.g) * t,
                b: baseColor.b + (secondColor.b - baseColor.b) * t,
              };
            }
            break;

          case "wave":
            {
              const noise =
                Math.sin(x * 0.6 + time) *
                Math.cos(y * 0.6 + time) *
                colorVariance;
              color = {
                r: Math.min(255, Math.max(0, baseColor.r + noise)),
                g: Math.min(255, Math.max(0, baseColor.g + noise)),
                b: Math.min(255, Math.max(0, baseColor.b + noise)),
              };
            }
            break;

          case "ripple":
            {
              const centerX = cols / 2;
              const centerY = rows / 2;
              const dx = x - centerX;
              const dy = y - centerY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const maxDistance = Math.sqrt(
                centerX * centerX + centerY * centerY
              );
              const normalizedDistance = distance / maxDistance;
              const ripple =
                Math.sin(normalizedDistance * 20 - time * 5) *
                Math.exp(-normalizedDistance * 3);
              const t = (ripple + 1) / 2;
              color = {
                r: baseColor.r + (secondColor.r - baseColor.r) * t,
                g: baseColor.g + (secondColor.g - baseColor.g) * t,
                b: baseColor.b + (secondColor.b - baseColor.b) * t,
              };
            }
            break;

          case "vortex":
            {
              const centerX = cols / 2;
              const centerY = rows / 2;
              const dx = x - centerX;
              const dy = y - centerY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx);
              // Create a more natural spiral pattern
              const spiral = angle + distance * 0.4;
              const vortexPattern = Math.sin(spiral - time * 1.6);
              const t = (vortexPattern + 1) / 2;
              color = {
                r: baseColor.r + (secondColor.r - baseColor.r) * t,
                g: baseColor.g + (secondColor.g - baseColor.g) * t,
                b: baseColor.b + (secondColor.b - baseColor.b) * t,
              };
            }
            break;

          case "pulse":
            {
              const centerX = cols / 2;
              const centerY = rows / 2;
              const dx = x - centerX;
              const dy = y - centerY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const maxDistance = Math.sqrt(
                centerX * centerX + centerY * centerY
              );
              const normalizedDistance = distance / maxDistance;
              const pulse = Math.sin(normalizedDistance * 10 - time * 5);
              const t = (pulse + 1) / 2;
              color = {
                r: baseColor.r + (secondColor.r - baseColor.r) * t,
                g: baseColor.g + (secondColor.g - baseColor.g) * t,
                b: baseColor.b + (secondColor.b - baseColor.b) * t,
              };
            }
            break;

          case "checkerboard":
            {
              const size = 4; // Size of each checkerboard square
              // const isEven =
              //   (Math.floor(x / size) + Math.floor(y / size)) % 2 === 0;
              const animatedOffset = (Math.sin(time * 2) * size) / 2;
              const adjustedX = x + animatedOffset;
              const adjustedY = y + animatedOffset;
              const adjustedIsEven =
                (Math.floor(adjustedX / size) + Math.floor(adjustedY / size)) %
                  2 ===
                0;
              color = adjustedIsEven ? baseColor : secondColor;
            }
            break;

          case "pixelWave":
            {
              const waveFrequency = 0.6;
              const waveAmplitude = 5;
              const waveSpeed = 2;

              // 创建水平和垂直波浪
              const horizontalWave =
                Math.sin(x * waveFrequency + time * waveSpeed) * waveAmplitude;
              const verticalWave =
                Math.cos(y * waveFrequency + time * waveSpeed) * waveAmplitude;

              // 组合波浪效果
              const combinedWave = (horizontalWave + verticalWave) / 2;

              // 量化波浪值以创建更明显的像素效果
              const quantizationLevels = 5;
              const quantizedWave =
                Math.floor(
                  ((combinedWave + waveAmplitude) / (2 * waveAmplitude)) *
                    quantizationLevels
                ) / quantizationLevels;

              // 使用波浪值在两种颜色之间插值
              color = {
                r: Math.round(
                  baseColor.r + (secondColor.r - baseColor.r) * quantizedWave
                ),
                g: Math.round(
                  baseColor.g + (secondColor.g - baseColor.g) * quantizedWave
                ),
                b: Math.round(
                  baseColor.b + (secondColor.b - baseColor.b) * quantizedWave
                ),
              };
            }
            break;

          default: {
            const noise = (Math.random() - 0.6) * 2 * colorVariance;
            color = {
              r: Math.min(255, Math.max(0, baseColor.r + noise)),
              g: Math.min(255, Math.max(0, baseColor.g + noise)),
              b: Math.min(255, Math.max(0, baseColor.b + noise)),
            };
          }
        }

        ctx.fillStyle = `rgb(${Math.round(color.r)}, ${Math.round(
          color.g
        )}, ${Math.round(color.b)})`;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }

    // Animate
    if (isAnimating) {
      frameRef.current = requestAnimationFrame(drawGrid);
    }
  }, [width, height, cellSize, colorVariance, baseColor, secondColor, animationType, isAnimating]);

  useEffect(() => {
    const savedState = localStorage.getItem("pixelGridState");
    if (savedState) {
      const {
        cellSize: savedCellSize,
        colorVariance: savedColorVariance,
        baseColor: savedBaseColor,
        secondColor: savedSecondColor,
        animationType: savedAnimationType,
      } = JSON.parse(savedState);
      setCellSize(savedCellSize);
      setColorVariance(savedColorVariance);
      setBaseColor(savedBaseColor);
      setSecondColor(savedSecondColor);
      setAnimationType(savedAnimationType as AnimationType);
    }
  }, []);

  useEffect(() => {
    drawGrid();
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [cellSize, colorVariance, baseColor, secondColor, animationType, isAnimating, drawGrid]);

  const handleColorChange = (
    channel: "r" | "g" | "b",
    value: number,
    isSecondary: boolean = false
  ) => {
    if (isSecondary) {
      setSecondColor((prev) => ({ ...prev, [channel]: value }));
    } else {
      setBaseColor((prev) => ({ ...prev, [channel]: value }));
    }
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const handleColorPickerChange = (
    color: string,
    isSecondary: boolean = false
  ) => {
    const rgb = hexToRgb(color);
    if (rgb) {
      if (isSecondary) {
        setSecondColor(rgb);
      } else {
        setBaseColor(rgb);
      }
    }
  };

  const saveState = () => {
    const state = {
      cellSize,
      colorVariance,
      baseColor,
      secondColor,
      animationType,
    };
    localStorage.setItem("pixelGridState", JSON.stringify(state));

    const canvas = canvasRef.current;
    if (canvas) {
      const imageData = canvas.toDataURL("image/png");
      localStorage.setItem("pixelGridImage", imageData);
    }
  };

  const loadState = () => {
    const savedState = localStorage.getItem("pixelGridState");
    const savedImage = localStorage.getItem("pixelGridImage");

    if (savedState) {
      const {
        cellSize: savedCellSize,
        colorVariance: savedColorVariance,
        baseColor: savedBaseColor,
        secondColor: savedSecondColor,
        animationType: savedAnimationType,
      } = JSON.parse(savedState);
      setCellSize(savedCellSize);
      setColorVariance(savedColorVariance);
      setBaseColor(savedBaseColor);
      setSecondColor(savedSecondColor);
      setAnimationType(savedAnimationType as AnimationType);
    }

    if (savedImage) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
          };
          img.src = savedImage;
        }
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Card className="p-6">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="shadow-lg"
        />
      </Card>

      <Card className="p-6 space-y-6 flex-grow">
        <div className="space-y-2">
          <Label htmlFor="animation-type">Animation Type</Label>
          <Select
            value={animationType}
            onValueChange={(value: AnimationType) => setAnimationType(value)}
          >
            <SelectTrigger id="animation-type">
              <SelectValue placeholder="Select animation type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wave">Wave</SelectItem>
              <SelectItem value="ripple">Ripple</SelectItem>
              <SelectItem value="stripes">Stripes</SelectItem>
              <SelectItem value="dots">Dots</SelectItem>
              <SelectItem value="vortex">Vortex</SelectItem>
              <SelectItem value="pulse">Pulse</SelectItem>
              <SelectItem value="checkerboard">Checkerboard</SelectItem>
              <SelectItem value="pixelWave">Pixel Wave</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pixel-size">Pixel Size: {cellSize}px</Label>
          <Slider
            id="pixel-size"
            value={[cellSize]}
            onValueChange={(value) => setCellSize(value[0])}
            min={20}
            max={60}
            step={10}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color-variance">
            Color Variance: {colorVariance}
          </Label>
          <Slider
            id="color-variance"
            value={[colorVariance]}
            onValueChange={(value) => setColorVariance(value[0])}
            min={0}
            max={100}
            step={5}
          />
        </div>

        <div className="space-y-1">
          <Label>Primary Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              value={rgbToHex(baseColor.r, baseColor.g, baseColor.b)}
              onChange={(e) => handleColorPickerChange(e.target.value)}
              className="w-12 h-12 p-1 rounded"
            />
            <div className="flex-grow space-y-2">
              <Label htmlFor="red-channel">Red: {baseColor.r}</Label>
              <Slider
                id="red-channel"
                value={[baseColor.r]}
                onValueChange={(value) => handleColorChange("r", value[0])}
                min={0}
                max={255}
                step={1}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-12 h-12"></div>
            <div className="flex-grow space-y-2">
              <Label htmlFor="green-channel">Green: {baseColor.g}</Label>
              <Slider
                id="green-channel"
                value={[baseColor.g]}
                onValueChange={(value) => handleColorChange("g", value[0])}
                min={0}
                max={255}
                step={1}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-12 h-12"></div>
            <div className="flex-grow space-y-2">
              <Label htmlFor="blue-channel">Blue: {baseColor.b}</Label>
              <Slider
                id="blue-channel"
                value={[baseColor.b]}
                onValueChange={(value) => handleColorChange("b", value[0])}
                min={0}
                max={255}
                step={1}
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <Label>Secondary Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              value={rgbToHex(secondColor.r, secondColor.g, secondColor.b)}
              onChange={(e) => handleColorPickerChange(e.target.value, true)}
              className="w-12 h-12 p-1 rounded"
            />
            <div className="flex-grow space-y-2">
              <Label htmlFor="sec-red-channel">Red: {secondColor.r}</Label>
              <Slider
                id="sec-red-channel"
                value={[secondColor.r]}
                onValueChange={(value) =>
                  handleColorChange("r", value[0], true)
                }
                min={0}
                max={255}
                step={1}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-12 h-12"></div>
            <div className="flex-grow space-y-2">
              <Label htmlFor="sec-green-channel">Green: {secondColor.g}</Label>
              <Slider
                id="sec-green-channel"
                value={[secondColor.g]}
                onValueChange={(value) =>
                  handleColorChange("g", value[0], true)
                }
                min={0}
                max={255}
                step={1}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-12 h-12"></div>
            <div className="flex-grow space-y-2">
              <Label htmlFor="sec-blue-channel">Blue: {secondColor.b}</Label>
              <Slider
                id="sec-blue-channel"
                value={[secondColor.b]}
                onValueChange={(value) =>
                  handleColorChange("b", value[0], true)
                }
                min={0}
                max={255}
                step={1}
              />
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setIsAnimating(!isAnimating)}>
            {isAnimating ? "Pause" : "Resume"} Animation
          </Button>
          <Button onClick={saveState}>Save State</Button>
          <Button onClick={loadState}>Load State</Button>
        </div>
      </Card>
    </div>
  );
}

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { drawPixelArt, COLORS, type Color } from '../utils/drawArt'

const Demo2 = () => {
  const [currentType, setCurrentType] = useState('random')
  const [colors, setColors] = useState<Color[]>(COLORS['color1'])
  const [alpha, setAlpha] = useState(255)
  const [contentSize, setContentSize] = useState(200)
  const [randomColors, setRandomColors] = useState<Color[]>([])
  const [backgroundColor, setBackgroundColor] = useState('#fcfea5')
  const [customColors, setCustomColors] = useState<Color[]>([])
  const [speed, setSpeed] = useState(1) // Update 1: Added speed state
  const size = 40
  const pixelSize = 10
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          // Clear the canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          
          // Apply circular clipping
          ctx.save()
          ctx.beginPath()
          ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2)
          ctx.clip()
          
          // Draw the background
          ctx.fillStyle = backgroundColor
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          
          // Draw the pixel art
          const initialColors: Color[][] = []
          const alphaValues: number[][] = []
          const colorsToUse = customColors.length > 0 ? customColors : (randomColors.length > 0 ? randomColors : colors)
          drawPixelArt(ctx, currentType, contentSize, pixelSize, initialColors, alphaValues, colorsToUse, alpha, (time / 1000) * speed) // Update 2: Added speed to drawPixelArt call
          
          ctx.restore()
        }
      }
    }
    
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }, [currentType, colors, alpha, contentSize, randomColors, backgroundColor, customColors, speed]) // Update 3: Added speed to useEffect dependency array

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [currentType, colors, alpha, contentSize, randomColors, backgroundColor, customColors, speed])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const canvasSize = size * pixelSize
      canvas.width = canvasSize
      canvas.height = canvasSize
    }
  }, [])

  const generateRandomColors = () => {
    const newColors: Color[] = Array(10).fill(null).map(() => [
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256)
    ])
    setRandomColors(newColors)
    setCustomColors(newColors)
    
    // Generate random background color
    const randomBgColor = `#${Math.floor(Math.random()*16777215).toString(16)}`
    setBackgroundColor(randomBgColor)
  }

  const handleCustomColorChange = (index: number, channel: 'r' | 'g' | 'b', value: number) => {
    setCustomColors(prevColors => {
      const newColors = [...prevColors]
      newColors[index] = [...newColors[index]]
      newColors[index][channel === 'r' ? 0 : channel === 'g' ? 1 : 2] = value
      return newColors
    })
  }

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }).join('')
  }

  const hexToRgb = (hex: string): Color => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0]
  }

  const handleColorPickerChange = (index: number, hex: string) => {
    const rgb = hexToRgb(hex)
    setCustomColors(prevColors => {
      const newColors = [...prevColors]
      newColors[index] = rgb
      return newColors
    })
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Card className="p-6 flex-grow">
        <div className="flex justify-center">
          <canvas ref={canvasRef} />
        </div>
      </Card>
      <Card className="p-6 space-y-6 w-full md:w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="animation-type">Animation Type</Label>
            <Select
              value={currentType}
              onValueChange={(value) => setCurrentType(value)}
            >
              <SelectTrigger id="animation-type">
                <SelectValue placeholder="Select animation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="random">Random</SelectItem>
                <SelectItem value="vertical-line">Vertical Line</SelectItem>
                <SelectItem value="row-line">Horizontal Line</SelectItem>
                <SelectItem value="diamond">Diamond</SelectItem>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="square">Square</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color-palette">Color Palette</Label>
            <Select
              value={Object.keys(COLORS).find(key => COLORS[key as keyof typeof COLORS] === colors) || ''}
              onValueChange={(value) => {
                setColors(COLORS[value as keyof typeof COLORS])
                setRandomColors([])
                setCustomColors([])
              }}
            >
              <SelectTrigger id="color-palette">
                <SelectValue placeholder="Select color palette" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="color1">Palette A</SelectItem>
                <SelectItem value="color2">Palette B</SelectItem>
                <SelectItem value="color3">Palette C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="saturation">Saturation: {alpha}</Label>
            <Slider
              id="saturation"
              min={100}
              max={255}
              step={1}
              value={[alpha]}
              onValueChange={(value) => setAlpha(value[0])}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content-size">Content Size: {contentSize}</Label>
            <Slider
              id="content-size"
              min={180}
              max={250}
              step={1}
              value={[contentSize]}
              onValueChange={(value) => setContentSize(value[0])}
            />
          </div>
          {/* Update 4: Added animation speed slider */}
          <div className="space-y-2">
            <Label htmlFor="animation-speed">Animation Speed: {speed.toFixed(1)}x</Label>
            <Slider
              id="animation-speed"
              min={0.1}
              max={5}
              step={0.1}
              value={[speed]}
              onValueChange={(value) => setSpeed(value[0])}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="background-color">Background Color</Label>
            <Input
              id="background-color"
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
            />
          </div>

          <Button onClick={generateRandomColors} className="w-full">
            Generate Random Colors and Background
          </Button>

          {(currentType === 'diamond' || currentType === 'circle' || currentType === 'square') && customColors.length > 0 && (
            <Tabs defaultValue="color1" className="w-full">
              <TabsList className="grid grid-cols-5 h-auto">
                {customColors.map((_, index) => (
                  <TabsTrigger key={index} value={`color${index + 1}`} className="text-xs py-1 px-2">
                    {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
              {customColors.map((color, index) => (
                <TabsContent key={index} value={`color${index + 1}`}>
                  <div className="space-y-2">
                    <Label htmlFor={`color-${index}`}>Color {index + 1}</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id={`color-${index}`}
                        type="color"
                        value={rgbToHex(color[0], color[1], color[2])}
                        onChange={(e) => handleColorPickerChange(index, e.target.value)}
                        className="w-12 h-8 p-0 rounded"
                      />
                      <div className="space-y-1 flex-grow">
                        {['r', 'g', 'b'].map((channel, channelIndex) => (
                          <Slider
                            key={channelIndex}
                            min={0}
                            max={255}
                            step={1}
                            value={[color[channelIndex]]}
                            onValueChange={(value) => handleCustomColorChange(index, channel as 'r' | 'g' | 'b', value[0])}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </Card>
    </div>
  )
}

export default Demo2


import PixelGridAdvanced from './pixel-grid-advanced'

export default function Demo() {
  return (
    <div className="p-4">
      <PixelGridAdvanced 
        width={600}
        height={600}
        initialColor={{ r: 75, g: 0, b: 130 }}
        secondaryColor={{ r: 255, g: 200, b: 0 }}
        variance={30}
      />
    </div>
  )
}


'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from 'next/dynamic'
const Demo = dynamic(() => import('./demo'), { ssr: false })
const Demo2 = dynamic(() => import('./demo2'), { ssr: false })

export default function Home() {
  const [activeTab, setActiveTab] = useState('demo2')

  return (
    <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="demo1">Mode1</TabsTrigger>
          <TabsTrigger value="demo2">Mode2</TabsTrigger>
        </TabsList>
        <TabsContent value="demo1" className="mt-6">
          <Demo />
        </TabsContent>
        <TabsContent value="demo2" className="mt-6">
          <Demo2 />
        </TabsContent>
      </Tabs>
    </div>
  )
}


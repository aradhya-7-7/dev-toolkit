"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Check } from "lucide-react"

export function ConversionTools() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <UnitConverter />
      <TimestampConverter />
      <NumberBaseConverter />
      <ImageConverter />
    </div>
  )
}

function ImageConverter() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [base64, setBase64] = useState("")
  const [copied, setCopied] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setBase64(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const downloadImage = () => {
    if (!base64 || !imageFile) return
    const link = document.createElement("a")
    link.href = base64
    link.download = `converted-${imageFile.name}`
    link.click()
  }

  const copyBase64 = () => {
    navigator.clipboard.writeText(base64)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="bg-white text-black border border-black/20 shadow-md rounded-xl p-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Image Converter</CardTitle>
        <CardDescription className="text-sm text-black/60">
          Convert image to base64 and download it
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image-upload" className="font-medium">Upload Image</Label>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-black/20 bg-white text-black hover:border-black transition duration-200"
          />
        </div>

        {base64 && (
          <>
            <img
              src={base64}
              alt="Preview"
              className="max-h-48 rounded border border-black/20"
            />
            <div className="space-y-2">
              <Label className="font-medium">Base64</Label>
              <div className="relative">
                <textarea
                  readOnly
                  value={base64}
                  rows={4}
                  className="w-full font-mono p-2 rounded border border-black/20 bg-white text-black"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyBase64}
                  className="absolute top-2 right-2 hover:text-white hover:bg-black transition-all duration-200"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                className="w-full border border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-200"
                onClick={downloadImage}
              >
                Download Image
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}



function UnitConverter() {
  const [value, setValue] = useState("16")
  const [fromUnit, setFromUnit] = useState("px")
  const [toUnit, setToUnit] = useState("rem")
  const [result, setResult] = useState("1rem")
  const [copied, setCopied] = useState(false)

  const unitCategories = {
    "CSS Units": ["px", "rem", "em", "vh", "vw", "%"],
    Length: ["mm", "cm", "in", "ft", "yd", "m", "km", "mi"],
    Weight: ["mg", "g", "kg", "oz", "lb", "ton"],
    Temperature: ["°C", "°F", "K"],
  }

  // Flattened list of all units
  const allUnits = Object.values(unitCategories).flat()

  const convert = () => {
    const numValue = Number.parseFloat(value)

    if (isNaN(numValue)) {
      setResult("Invalid number")
      return
    }

    // For this demo, we'll implement a few common conversions
    if (fromUnit === "px" && toUnit === "rem") {
      // Assuming 1rem = 16px
      setResult(`${(numValue / 16).toFixed(4)}rem`)
    } else if (fromUnit === "rem" && toUnit === "px") {
      // 1rem = 16px
      setResult(`${(numValue * 16).toFixed(2)}px`)
    } else if (fromUnit === "cm" && toUnit === "in") {
      // 1in = 2.54cm
      setResult(`${(numValue / 2.54).toFixed(4)}in`)
    } else if (fromUnit === "in" && toUnit === "cm") {
      // 1in = 2.54cm
      setResult(`${(numValue * 2.54).toFixed(4)}cm`)
    } else if (fromUnit === "°C" && toUnit === "°F") {
      // °F = °C * 9/5 + 32
      setResult(`${((numValue * 9) / 5 + 32).toFixed(2)}°F`)
    } else if (fromUnit === "°F" && toUnit === "°C") {
      // °C = (°F - 32) * 5/9
      setResult(`${(((numValue - 32) * 5) / 9).toFixed(2)}°C`)
    } else if (fromUnit === toUnit) {
      setResult(`${numValue}${toUnit}`)
    } else {
      setResult(`Conversion from ${fromUnit} to ${toUnit} not implemented yet`)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unit Converter</CardTitle>
        <CardDescription>Convert between different units of measurement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="unit-value">Value</Label>
          <Input
            id="unit-value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
            inputMode="decimal"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>From</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue placeholder="From unit" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(unitCategories).map(([category, units]) => (
                  <div key={category}>
                    <div className="text-xs text-muted-foreground px-2 py-1">{category}</div>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>To</Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger>
                <SelectValue placeholder="To unit" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(unitCategories).map(([category, units]) => (
                  <div key={category}>
                    <div className="text-xs text-muted-foreground px-2 py-1">{category}</div>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={convert} className="w-full">
          Convert
        </Button>

        <div className="relative">
          <Label>Result</Label>
          <div className="flex items-center mt-2">
            <Input value={result} readOnly className="pr-10 font-mono" />
            <Button size="sm" variant="ghost" className="absolute right-0 h-10" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TimestampConverter() {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000).toString())
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16))
  const [mode, setMode] = useState<"timestamp-to-date" | "date-to-timestamp">("timestamp-to-date")
  const [result, setResult] = useState("")
  const [copied, setCopied] = useState(false)

  const convert = () => {
    try {
      if (mode === "timestamp-to-date") {
        const ts = Number.parseInt(timestamp)
        if (isNaN(ts)) {
          setResult("Invalid timestamp")
          return
        }

        // Check if milliseconds or seconds
        const d =
          ts > 9999999999
            ? new Date(ts) // milliseconds
            : new Date(ts * 1000) // seconds

        setResult(d.toISOString())
      } else {
        const d = new Date(date)
        if (d.toString() === "Invalid Date") {
          setResult("Invalid date")
          return
        }

        setResult(Math.floor(d.getTime() / 1000).toString())
      }
    } catch (error) {
      setResult("Conversion error")
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timestamp Converter</CardTitle>
        <CardDescription>Convert between Unix timestamps and human-readable dates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs
          defaultValue="timestamp-to-date"
          onValueChange={(value) => setMode(value as "timestamp-to-date" | "date-to-timestamp")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timestamp-to-date">Timestamp to Date</TabsTrigger>
            <TabsTrigger value="date-to-timestamp">Date to Timestamp</TabsTrigger>
          </TabsList>

          <TabsContent value="timestamp-to-date" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="unix-timestamp">Unix Timestamp</Label>
              <Input
                id="unix-timestamp"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder="Enter Unix timestamp"
              />
            </div>
          </TabsContent>

          <TabsContent value="date-to-timestamp" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date-input">Date and Time</Label>
              <Input id="date-input" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </TabsContent>
        </Tabs>

        <Button onClick={convert} className="w-full">
          Convert
        </Button>

        {result && (
          <div className="relative">
            <Label>Result</Label>
            <div className="flex items-center mt-2">
              <Input value={result} readOnly className="pr-10 font-mono" />
              <Button size="sm" variant="ghost" className="absolute right-0 h-10" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function NumberBaseConverter() {
  const [input, setInput] = useState("255")
  const [fromBase, setFromBase] = useState("10")
  const [toBase, setToBase] = useState("16")
  const [result, setResult] = useState("FF")
  const [copied, setCopied] = useState(false)

  const bases = [
    { value: "2", label: "Binary (2)" },
    { value: "8", label: "Octal (8)" },
    { value: "10", label: "Decimal (10)" },
    { value: "16", label: "Hexadecimal (16)" },
    { value: "36", label: "Base36 (0-9, A-Z)" },
  ]

  const convert = () => {
    try {
      const num = Number.parseInt(input, Number.parseInt(fromBase))
      if (isNaN(num)) {
        setResult("Invalid number for the selected base")
        return
      }

      const converted = num.toString(Number.parseInt(toBase)).toUpperCase()
      setResult(converted)
    } catch (error) {
      setResult("Conversion error")
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Number Base Converter</CardTitle>
        <CardDescription>Convert between binary, decimal, hex, and other bases</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="number-input">Number</Label>
          <Input
            id="number-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter number"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>From Base</Label>
            <Select value={fromBase} onValueChange={setFromBase}>
              <SelectTrigger>
                <SelectValue placeholder="From base" />
              </SelectTrigger>
              <SelectContent>
                {bases.map((base) => (
                  <SelectItem key={base.value} value={base.value}>
                    {base.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>To Base</Label>
            <Select value={toBase} onValueChange={setToBase}>
              <SelectTrigger>
                <SelectValue placeholder="To base" />
              </SelectTrigger>
              <SelectContent>
                {bases.map((base) => (
                  <SelectItem key={base.value} value={base.value}>
                    {base.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={convert} className="w-full">
          Convert
        </Button>

        <div className="relative">
          <Label>Result</Label>
          <div className="flex items-center mt-2">
            <Input value={result} readOnly className="pr-10 font-mono" />
            <Button size="sm" variant="ghost" className="absolute right-0 h-10" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

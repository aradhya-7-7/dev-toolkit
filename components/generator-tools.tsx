"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import jwt from "jsonwebtoken"

export function GeneratorTools() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <UuidGenerator />
      <RandomStringGenerator />
      <QrCodeGenerator />
      <SlugGenerator />
      <Base64Tool />
      <ColorConverter />
      <JwtTool />

      {/* <Card>
        <CardHeader>
          <CardTitle>JWT Encoder/Decoder</CardTitle>
          <CardDescription>Encode and decode JWT tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Coming Soon</span>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}

function UuidGenerator() {
  const [uuid, setUuid] = useState("")
  const [copied, setCopied] = useState(false)

  const generateUuid = () => {
    const newUuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
    setUuid(newUuid)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uuid)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>UUID Generator</CardTitle>
        <CardDescription>Generate random UUIDs (v4)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={generateUuid} className="w-full">
          Generate UUID
        </Button>

        {uuid && (
          <div className="relative">
            <Input value={uuid} readOnly className="pr-10 font-mono text-sm" />
            <Button size="sm" variant="ghost" className="absolute top-0 right-0 h-full" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function RandomStringGenerator() {
  const [length, setLength] = useState(12)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSpecial, setIncludeSpecial] = useState(false)
  const [_randomString, set_randomString] = useState("")
  const [copied, setCopied] = useState(false)

  const generateRandomString = () => {
    let chars = ""
    if (includeUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeLowercase) chars += "abcdefghijklmnopqrstuvwxyz"
    if (includeNumbers) chars += "0123456789"
    if (includeSpecial) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (chars.length === 0) {
      chars = "abcdefghijklmnopqrstuvwxyz"
    }

    let result = ""
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    set_randomString(result)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(_randomString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Random String Generator</CardTitle>
        <CardDescription>Generate random strings with custom options</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Length: {length}</Label>
          </div>
          <Slider value={[length]} min={1} max={64} step={1} onValueChange={(value) => setLength(value[0])} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="uppercase"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="uppercase">Uppercase</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="lowercase"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="lowercase">Lowercase</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="numbers"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="numbers">Numbers</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="special"
              checked={includeSpecial}
              onChange={(e) => setIncludeSpecial(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="special">Special</Label>
          </div>
        </div>

        <Button onClick={generateRandomString} className="w-full">
          Generate String
        </Button>

        {_randomString && (
          <div className="relative">
            <Input value={_randomString} readOnly className="pr-10 font-mono text-sm" />
            <Button size="sm" variant="ghost" className="absolute top-0 right-0 h-full" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function QrCodeGenerator() {
  const [text, setText] = useState("https://example.com")
  const [qrCode, setQrCode] = useState("")
  const [size, setSize] = useState(200)

  const generateQrCode = () => {
    // In a real implementation, you would use a QR code library
    // For this demo, we'll just simulate it with a placeholder
    setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Generator</CardTitle>
        <CardDescription>Generate QR codes from text or URLs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="qr-text">Text or URL</Label>
          <Input id="qr-text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text or URL" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>
              Size: {size}x{size}
            </Label>
          </div>
          <Slider value={[size]} min={100} max={500} step={10} onValueChange={(value) => setSize(value[0])} />
        </div>

        <Button onClick={generateQrCode} className="w-full">
          Generate QR Code
        </Button>

        {qrCode && (
          <div className="flex justify-center mt-4">
            <img src={qrCode || "/placeholder.svg"} alt="Generated QR Code" className="border" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SlugGenerator() {
  const [text, setText] = useState("Your Product or Article Title")
  const [slug, setSlug] = useState("")
  const [copied, setCopied] = useState(false)

  const generateSlug = () => {
    const newSlug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .trim() // Trim leading/trailing spaces

    setSlug(newSlug)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(slug)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Slug Generator</CardTitle>
        <CardDescription>Convert titles to URL-friendly slugs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="slug-text">Text</Label>
          <Input
            id="slug-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to convert to slug"
          />
        </div>

        <Button onClick={generateSlug} className="w-full">
          Generate Slug
        </Button>

        {slug && (
          <div className="relative">
            <Input value={slug} readOnly className="pr-10 font-mono text-sm" />
            <Button size="sm" variant="ghost" className="absolute top-0 right-0 h-full" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Base64Tool() {
  const [input, setInput] = useState("Hello, World!")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [copied, setCopied] = useState(false)

  const processBase64 = () => {
    try {
      if (mode === "encode") {
        setOutput(btoa(input))
      } else {
        setOutput(atob(input))
      }
    } catch (error) {
      setOutput("Error: Invalid input for " + mode)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Base64 Encoder/Decoder</CardTitle>
        <CardDescription>Convert text to and from Base64 encoding</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="encode" onValueChange={(value) => setMode(value as "encode" | "decode")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-2">
          <Label htmlFor="base64-input">Input</Label>
          <Input
            id="base64-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Text to encode" : "Base64 to decode"}
          />
        </div>

        <Button onClick={processBase64} className="w-full">
          {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
        </Button>

        {output && (
          <div className="relative">
            <Label htmlFor="base64-output">Output</Label>
            <Input id="base64-output" value={output} readOnly className="pr-10 font-mono text-sm mt-2" />
            <Button size="sm" variant="ghost" className="absolute bottom-0 right-0 h-10" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function JwtTool() {
  const [token, setToken] = useState("")
  const [decoded, setDecoded] = useState("")
  const [secret, setSecret] = useState("")
  const [payload, setPayload] = useState("")
  const [encoded, setEncoded] = useState("")
  const [copied, setCopied] = useState(false)

  const decodeJwt = () => {
    try {
      const decodedObj = jwt.decode(token, { complete: true })
      setDecoded(JSON.stringify(decodedObj, null, 2))
    } catch (err) {
      setDecoded("Invalid JWT")
    }
  }

  const encodeJwt = () => {
    try {
      const payloadObj = JSON.parse(payload)
      const token = jwt.sign(payloadObj, secret || "secret", { algorithm: "HS256" })
      setEncoded(token)
    } catch {
      setEncoded("Invalid Payload")
    }
  }

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="bg-white text-black border border-black/20 shadow-md rounded-xl p-4 space-y-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold">JWT Encoder / Decoder</CardTitle>
        <CardDescription className="text-sm text-black/60">
          Encode or decode JSON Web Tokens
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="font-medium">JWT Token</Label>
          <Input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste JWT here"
            className="border border-black/20 bg-white text-black hover:border-black transition duration-200"
          />
          <Button
            onClick={decodeJwt}
            className="w-full border bg-black text-white hover:bg-white hover:text-black transition-all duration-200"
          >
            Decode
          </Button>
        </div>

        {decoded && (
          <div className="space-y-2">
            <Label className="font-medium">Decoded</Label>
            <div className="relative">
              <textarea
                readOnly
                rows={6}
                value={decoded}
                className="w-full font-mono p-2 rounded border border-black/20 bg-white text-black"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyText(decoded)}
                className="absolute top-2 right-2 hover:text-white hover:bg-black transition-all duration-200"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2 pt-4 border-t border-black/10">
          <Label className="font-medium">Payload (JSON)</Label>
          <textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            rows={4}
            placeholder='{"user": "admin"}'
            className="w-full font-mono p-2 rounded border border-black/20 bg-white text-black"
          />
          <Input
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Secret key (default: 'secret')"
            className="border border-black/20 bg-white text-black hover:border-black transition duration-200"
          />
          <Button
            onClick={encodeJwt}
            className="w-full border bg-black text-white hover:bg-white hover:text-black transition-all duration-200"
          >
            Encode
          </Button>
        </div>

        {encoded && (
          <div className="space-y-2">
            <Label className="font-medium">Encoded JWT</Label>
            <div className="relative">
              <textarea
                readOnly
                value={encoded}
                rows={4}
                className="w-full font-mono p-2 rounded border border-black/20 bg-white text-black"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyText(encoded)}
                className="absolute top-2 right-2 hover:text-white hover:bg-black transition-all duration-200"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ColorConverter() {
  const [hex, setHex] = useState("#3B82F6")
  const [rgb, setRgb] = useState("59, 130, 246")
  const [hsl, setHsl] = useState("217, 91%, 60%")
  const [copied, setCopied] = useState<string | null>(null)

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return null

    const r = Number.parseInt(result[1], 16)
    const g = Number.parseInt(result[2], 16)
    const b = Number.parseInt(result[3], 16)

    return `${r}, ${g}, ${b}`
  }

  const hexToHsl = (hex: string) => {
    // Convert hex to RGB first
    let r = 0,
      g = 0,
      b = 0
    if (hex.length === 4) {
      r = Number.parseInt(hex[1] + hex[1], 16)
      g = Number.parseInt(hex[2] + hex[2], 16)
      b = Number.parseInt(hex[3] + hex[3], 16)
    } else if (hex.length === 7) {
      r = Number.parseInt(hex.substring(1, 3), 16)
      g = Number.parseInt(hex.substring(3, 5), 16)
      b = Number.parseInt(hex.substring(5, 7), 16)
    }

    // Then to HSL
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
      s = 0,
      l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }

      h /= 6
    }

    h = Math.round(h * 360)
    s = Math.round(s * 100)
    l = Math.round(l * 100)

    return `${h}, ${s}%, ${l}%`
  }

  const updateFromHex = (newHex: string) => {
    setHex(newHex)
    const newRgb = hexToRgb(newHex)
    const newHsl = hexToHsl(newHex)

    if (newRgb) setRgb(newRgb)
    if (newHsl) setHsl(newHsl)
  }

  const copyToClipboard = (value: string, type: string) => {
    navigator.clipboard.writeText(value)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Code Converter</CardTitle>
        <CardDescription>Convert between HEX, RGB, and HSL color formats</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 rounded-md border" style={{ backgroundColor: hex }} />
          <input type="color" value={hex} onChange={(e) => updateFromHex(e.target.value)} className="w-12 h-12" />
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Label htmlFor="hex-color">HEX</Label>
            <Input
              id="hex-color"
              value={hex}
              onChange={(e) => updateFromHex(e.target.value)}
              className="pr-10 font-mono"
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute bottom-0 right-0 h-10"
              onClick={() => copyToClipboard(hex, "hex")}
            >
              {copied === "hex" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="relative">
            <Label htmlFor="rgb-color">RGB</Label>
            <Input id="rgb-color" value={rgb} readOnly className="pr-10 font-mono" />
            <Button
              size="sm"
              variant="ghost"
              className="absolute bottom-0 right-0 h-10"
              onClick={() => copyToClipboard(`rgb(${rgb})`, "rgb")}
            >
              {copied === "rgb" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="relative">
            <Label htmlFor="hsl-color">HSL</Label>
            <Input id="hsl-color" value={hsl} readOnly className="pr-10 font-mono" />
            <Button
              size="sm"
              variant="ghost"
              className="absolute bottom-0 right-0 h-10"
              onClick={() => copyToClipboard(`hsl(${hsl})`, "hsl")}
            >
              {copied === "hsl" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

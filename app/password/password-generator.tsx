'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { savePassword } from "@/lib/password-storage"
import { Copy, RefreshCw, Save, Check } from "lucide-react"
import { PasswordStrengthMeter } from "./password-strength-meter"
import { toast } from "sonner"

export default function PasswordGenerator() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [serviceName, setServiceName] = useState('')
  const [copied, setCopied] = useState(false)

  const generatePassword = useCallback(() => {
    let charset = ''
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-="

    if (charset === "") {
      setIncludeLowercase(true)
      charset = "abcdefghijklmnopqrstuvwxyz"
      toast.warning("At least one character type must be selected. Defaulting to lowercase.")
    }

    let newPassword = ""
    const crypto = window.crypto || (window as any).msCrypto
    const values = new Uint32Array(length)
    crypto.getRandomValues(values)

    for (let i = 0; i < length; i++) {
      const randomIndex = values[i] % charset.length
      newPassword += charset[randomIndex]
    }
    setPassword(newPassword)
  }, [includeLowercase, includeNumbers, includeSymbols, includeUppercase, length])

  useEffect(() => {
    generatePassword()
  }, [generatePassword])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      toast.success("Password copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copt password', err)
      toast.error("Failed to copy password")
    }
  }

  const handleSavePassword = () => {
    if (!serviceName.trim()) {
      toast.error("Please enter a service name")
      return
    }

    try {
      savePassword(serviceName, password)
      toast.success(`Password saved for ${serviceName}`)
      setServiceName("")
      generatePassword()
    } catch (error) {
      console.error('Failed to save password', error)
      toast.error("Failed to save password")
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          value={password}
          readOnly
          className="pr-24 font-mono text-lg h-14"
          onClick={copyToClipboard}
        />
        <div className="absolute right-2 top-2 flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={generatePassword}
            title="Generate new password"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            title="Copy to clipboard"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <PasswordStrengthMeter password={password} />

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="length">Length: {length}</Label>
            <span className="text-sm text-muted-foreground">{length >= 20 ? "Strong" : length >= 12 ? "Good" : "Weak"}</span>
          </div>
          <Slider
            id="length"
            min={8}
            max={64}
            step={1}
            value={[length]}
            onValueChange={(value) => setLength(value[0])}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="uppercase"
              checked={includeUppercase}
              onCheckedChange={(checked) => setIncludeUppercase(checked as boolean)}
            />
            <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="lowercase"
              checked={includeLowercase}
              onCheckedChange={(checked) => setIncludeLowercase(checked as boolean)}
            />
            <Label htmlFor="lowercase">Lowercase (a-z)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="numbers"
              checked={includeNumbers}
              onCheckedChange={(checked) => setIncludeNumbers(checked as boolean)}
            />
            <Label htmlFor="numbers">Numbers (0-9)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="symbols"
              checked={includeSymbols}
              onCheckedChange={(checked) => setIncludeSymbols(checked as boolean)}
            />
            <Label htmlFor="symbols">Symbols (!@#$%)</Label>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <h3 className="text-lg font-medium mb-2">Save this password</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Service name (e.g., Spotify, Netflix)"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSavePassword()}
          />
          <Button
            onClick={handleSavePassword}
            disabled={!serviceName.trim()}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
'use client'
import { useMemo } from "react"
interface PasswordStrenthMeterProps {
  password: string
}

export function PasswordStrengthMeter({ password }: PasswordStrenthMeterProps) {
  const strength = useMemo(() => {
    if (!password) return 0
    let score = 0
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (password.length >= 16) score += 1

    if (/[A-Z]/.test(password)) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    return Math.min(4, Math.floor(score / 2))
  }, [password])

  const getStrengthLabel = () => {
    switch (strength) {
      case 0:
        return "Very Weak"
      case 1:
        return "Weak"
      case 2:
        return "Medium"
      case 3:
        return "Strong"
      case 4:
        return "Very Strong"
      default:
        return ""
    }
  }

  const getStrengthColor = () => {
    switch (strength) {
      case 0:
        return "bg-red-500"
      case 1:
        return "bg-orange-500"
      case 2:
        return "bg-yellow-500"
      case 3:
        return "bg-green-500"
      case 4:
        return "bg-emerald-500"
      default:
        return "bg-slate-200"
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Password Strength</span>
        <span className="font-medium">
          {
            getStrengthLabel()
          }
        </span>
      </div>
      <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${getStrengthColor()} transition-all duration-300`}
          style={{ width: `${(strength / 4) * 100}%` }}
        />
      </div>
    </div>

  )
}
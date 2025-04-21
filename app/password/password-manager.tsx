'use client'
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Copy, Edit, Eye, EyeOff, Search, Trash2, Check } from "lucide-react"
import { getPasswords, deletePassword, updatePassword } from "@/lib/password-storage"
import { toast } from "sonner"

interface StoredPassword {
  id: string
  service: string
  password: string
}

export default function PasswordManager() {
  const [passwords, setPasswords] = useState<StoredPassword[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({})
  const [editingPassword, setEditingPassword] = useState<StoredPassword | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [newService, setNewService] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const loadPasswords = () => {
    const storedPasswords = getPasswords()
    setPasswords(storedPasswords)
  }

  useEffect(() => {
    loadPasswords()
  }, [])

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleCopyPassword = async (password: string, id: string) => {
    try {
      await navigator.clipboard.writeText(password)
      setCopiedId(id)
      toast.success("Password copied to clipboard!")
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy password', err)
      toast.error("Failed to copy password")
    }
  }

  const handleDeletePassword = (id: string) => {
    try {
      deletePassword(id)
      loadPasswords()
      toast.success("Password deleted successfully")
    } catch (error) {
      console.error('Failed to delete password', error)
      toast.error("Failed to delete password")
    }
  }

  const handleEditPassword = () => {
    if (!editingPassword) return

    try {
      updatePassword(
        editingPassword.id,
        newService || editingPassword.service,
        newPassword || editingPassword.password
      )
      loadPasswords()
      setEditingPassword(null)
      setNewPassword("")
      setNewService("")
      toast.success("Password updated successfully")
    } catch (error) {
      console.error('Failed to update password', error)
      toast.error("Failed to update password")
    }
  }

  const startEditing = (password: StoredPassword) => {
    setEditingPassword(password)
    setNewPassword(password.password)
    setNewService(password.service)
  }

  const filteredPasswords = passwords.filter((p) =>
    p.service.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search passwords..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {passwords.length === 0 ? (
        <div className="text-center py-12 space-y-1 text-muted-foreground">
          <p className="font-medium">No saved passwords yet</p>
          <p className="text-sm">Generate and save a password to see it here</p>
        </div>
      ) : filteredPasswords.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No passwords match your search</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Service</TableHead>
                <TableHead className="w-[40%]">Password</TableHead>
                <TableHead className="w-[20%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPasswords.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.service}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">
                        {visiblePasswords[item.id] ? item.password : "••••••••••••"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => togglePasswordVisibility(item.id)}
                        className="h-8 w-8"
                      >
                        {visiblePasswords[item.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyPassword(item.password, item.id)}
                        className="h-8 w-8"
                        title="Copy password"
                      >
                        {copiedId === item.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditing(item)}
                            className="h-8 w-8"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Password</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Service Name</Label>
                              <Input
                                value={newService}
                                onChange={(e) => setNewService(e.target.value)}
                                placeholder="Enter service name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Password</Label>
                              <Input
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                type={visiblePasswords[item.id] ? "text" : "password"}
                                placeholder="Enter new password"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setEditingPassword(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleEditPassword}
                              disabled={!newService.trim() || !newPassword.trim()}
                            >
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePassword(item.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
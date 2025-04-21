import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PasswordGenerator from "./password/password-generator"
import PasswordManager from "./password/password-manager"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-slate-800 dark:text-slate-100">Safe Key</h1>
          <p className="text-slate-600 dark:text-slate-400">Generate secure passwords and store them safely</p>
        </div>

        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger
              value="generator"
              className="focus:outline-none focus-visible:ring-2 ring-offset-2 ring-sky-500 transition-colors"
            >
              Password Generator
            </TabsTrigger>
            <TabsTrigger
              value="manager"
              className="focus:outline-none focus-visible:ring-2 ring-offset-2 ring-sky-500 transition-colors"
            >
              Password Manager
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="generator"
            className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md transition-opacity duration-300 ease-in-out"
          >
            <PasswordGenerator />
          </TabsContent>

          <TabsContent value="manager" className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <PasswordManager />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

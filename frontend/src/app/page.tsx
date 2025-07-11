import { MedicalCodingForm } from "@/components/medical-coding-form"
import { ModeToggle } from "@/components/mode-toggle"
import Image from "next/image"

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-muted/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-800/50" />

      {/* Content */}
      <div className="relative">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg ">
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <path d="M3 10h18" />
                  <path d="M4 6h16a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z" />
                  <path d="M12 14v-4" />
                  <path d="M10 12h4" />
                <img src="./aqkode-logo.png" alt="" />
              </div>
              <div>
                {/* <h1 className="text-xl font-bold tracking-tight">ICD-10 Medical Coding Assistant</h1> */}
                {/* <p className="text-sm text-muted-foreground">Powered by Gemini 2.0 Flash</p> */}
                <Image src="/aqkode-logo.png" alt="Aqkode Logo" width={150} height={24} />

              </div>
            </div>
            <ModeToggle />
          </div>
        </header>

        <main className="container relative mx-auto">
          <div className="flex min-h-[calc(100vh-4rem)] flex-col">
            <div className="flex-1">
              <div className="mx-auto max-w-4xl py-12">
                <div className="mb-8 space-y-4 text-center">
                <div className="flex items-center justify-center gap-3">
                    
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">AQKoder</h2>
                  <Image src="/aqkode.png" alt="Aqkode Logo" width={40} height={40} />
  
                    </div>

                  <p className="mx-auto max-w-[700px] text-muted-foreground">
                  	Enter medical conditions to receive accurate Related ICD-10 codes 
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm md:p-8 mx-auto">
                  <MedicalCodingForm />
                </div>
              </div>
            </div>

            <footer className="border-t py-6 md:py-0">
              <div className="container flex flex-col items-center gap-4 md:h-16 md:flex-row md:justify-between">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Powered by Newtech Infosoft Pvt. Ltd. 
                </p>
                <p className="text-center text-sm text-muted-foreground md:text-left">
                Demo Version 1.0
                </p>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}


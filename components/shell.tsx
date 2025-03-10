"use client"

import type React from "react"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Menu, Users, PlusCircle, Home, ChevronRight } from "lucide-react"
import { businessFunctions, getProjectsByBusinessFunctionId } from "@/lib/data"

export function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Extract business function ID from path
  const businessFunctionId = pathname.includes("/business-function/")
    ? pathname.split("/business-function/")[1].split("/")[0]
    : null

  // Get projects for the current business function
  const projects = businessFunctionId ? getProjectsByBusinessFunctionId(businessFunctionId) : []

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-16 items-center border-b px-6">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setOpen(false)}>
                <LayoutDashboard className="h-6 w-6" />
                <span>Project Management</span>
              </Link>
            </div>
            <ScrollArea className="h-[calc(100vh-4rem)]">
              <div className="px-6 py-4">
                <nav className="grid gap-2 text-lg font-medium">
                  <Link
                    href="/"
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                      pathname === "/" ? "bg-accent" : "hover:bg-accent",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                  <div className="mt-6">
                    <h4 className="mb-2 px-3 text-sm font-semibold text-muted-foreground">Business Functions</h4>
                    {businessFunctions.map((bf) => (
                      <Link
                        key={bf.id}
                        href={`/business-function/${bf.id}`}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                          pathname === `/business-function/${bf.id}` ? "bg-accent" : "hover:bg-accent",
                        )}
                        onClick={() => setOpen(false)}
                      >
                        {bf.name}
                      </Link>
                    ))}
                  </div>
                  {businessFunctionId && (
                    <div className="mt-6">
                      <h4 className="mb-2 px-3 text-sm font-semibold text-muted-foreground">Projects</h4>
                      {projects.map((project) => (
                        <Link
                          key={project.id}
                          href={`/business-function/${businessFunctionId}/project/${project.id}`}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                            pathname === `/business-function/${businessFunctionId}/project/${project.id}`
                              ? "bg-accent"
                              : "hover:bg-accent",
                          )}
                          onClick={() => setOpen(false)}
                        >
                          {project.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </nav>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <LayoutDashboard className="h-6 w-6" />
          <span>Cortex | Digital Colleagues</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Team</span>
          </Button>
        </div>
      </header>
      <div className="grid md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r bg-muted/40 md:block">
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="flex flex-col gap-2 p-4">
              <Link
                href="/"
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  pathname === "/" ? "bg-accent" : "hover:bg-accent",
                )}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <div className="mt-8">
                <div className="flex items-center justify-between mb-2 px-3">
                  <h4 className="text-sm font-semibold text-muted-foreground">Business Functions</h4>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <PlusCircle className="h-4 w-4" />
                    <span className="sr-only">Add Business Function</span>
                  </Button>
                </div>
                {businessFunctions.map((bf) => (
                  <Link
                    key={bf.id}
                    href={`/business-function/${bf.id}`}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                      pathname === `/business-function/${bf.id}` ? "bg-accent" : "hover:bg-accent",
                    )}
                  >
                    <span>{bf.name}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
              {businessFunctionId && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-2 px-3">
                    <h4 className="text-sm font-semibold text-muted-foreground">Projects</h4>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <PlusCircle className="h-4 w-4" />
                      <span className="sr-only">Add Project</span>
                    </Button>
                  </div>
                  {projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/business-function/${businessFunctionId}/project/${project.id}`}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                        pathname === `/business-function/${businessFunctionId}/project/${project.id}`
                          ? "bg-accent"
                          : "hover:bg-accent",
                      )}
                    >
                      <span>{project.name}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </aside>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</main>
      </div>
    </div>
  )
}


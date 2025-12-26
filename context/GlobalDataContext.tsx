"use client"

import { createContext, useContext } from "react"

type GlobalItem = {
  id: string
  name: string
  type: string
  value: string
}

const GlobalDataContext = createContext<GlobalItem[] | null>(null)

export function GlobalDataProvider({ data, children }: { data: GlobalItem[] | null, children: React.ReactNode }) {

  return (
    <GlobalDataContext.Provider value={data}>
      {children}
    </GlobalDataContext.Provider>
  )
}

export function useGlobalData() {
  const ctx = useContext(GlobalDataContext)
  if (!ctx) throw new Error("useGlobalData debe usarse dentro del Provider")
  return ctx
}

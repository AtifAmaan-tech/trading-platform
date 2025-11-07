"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const navItems = ["Dashboard", "Trade", "Portfolio"]

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("Dashboard")
  const navigate = useNavigate()
  const location = useLocation()

  // 🔹 Sync active tab with current URL
  useEffect(() => {
    if (location.pathname === "/") setActiveTab("Dashboard")
    else if (location.pathname === "/trade") setActiveTab("Trade")
    else if (location.pathname === "/portfolio") setActiveTab("Portfolio")
    else if (location.pathname === "/orders") setActiveTab("Orders")
    else if (location.pathname === "/leaderboard") setActiveTab("Leaderboard")
    else if (location.pathname === "/settings") setActiveTab("Settings")
  }, [location.pathname])

  const handleNavClick = (item: string) => {
    setActiveTab(item)
    if (item === "Dashboard") navigate("/")
    if (item === "Trade") navigate("/trade")
    if (item === "Portfolio") navigate("/portfolio")
    if (item === "Orders") navigate("/orders")
    if (item === "Leaderboard") navigate("/leaderboard")
    if (item === "Settings") navigate("/settings")
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            TradeX
          </div>
          <div className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === item
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage src="https://api.dicebear.com/9.x/fun-emoji/svg" alt="avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

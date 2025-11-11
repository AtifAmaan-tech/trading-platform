"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "../auth/authcontext";

const navItems = ["Dashboard", "Trade", "Portfolio"];

export default function Navbar() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // 🔹 Avatar menu state
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/home")
      setActiveTab("Dashboard");
    else if (location.pathname === "/trade") setActiveTab("Trade");
    else if (location.pathname === "/portfolio") setActiveTab("Portfolio");
  }, [location.pathname]);

  const handleNavClick = (item: string) => {
    setActiveTab(item);
    if (item === "Dashboard") navigate("/");
    if (item === "Trade") navigate("/trade");
    if (item === "Portfolio") navigate("/portfolio");
  };

  const handleLogout = async () => {
    console.log("Logging out...");

    try {
      logout();
      console.log("Logout successfull");
    } catch (err) {
      console.error("Error logging out:", err);
    }

    navigate("/");
  };

  // 🔹 Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background">
      <div className="mx-auto px-12 py-4 flex items-center justify-between">
        {/* Logo + Nav links */}
        <div className="flex items-center gap-8">
          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            TradeX
          </div>

          <div className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === item
                    ? "bg-gradient-to-r from-purple-800 to-purple-700 hover:from-purple-600 hover:to-purple-700 text-white rounded-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* ✅ Custom Avatar Menu */}
        <div className="relative" ref={menuRef}>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full p-0"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage
                src="https://api.dicebear.com/9.x/fun-emoji/svg"
                alt="avatar"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Button>

          {/* Custom dropdown menu */}
          {menuOpen && (
            <div className="absolute left-1/2 -translate-x-1/2  mt-2 w-21 h-9 rounded-lg border border-primary">
              <button
                onClick={handleLogout}
                className="w-full ml-4 mt-1 text-left hover:bg-muted rounded-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "../auth/authcontext";

const navItems: string[] = ["Dashboard", "Trade", "Portfolio"];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState<string>(location.pathname);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/home")
      setActiveTab("Dashboard");
    else if (location.pathname === "/trade") setActiveTab("Trade");
    else if (location.pathname === "/portfolio") setActiveTab("Portfolio");
  }, [location.pathname]);

  const handleNavClick = (item: string) => {
    setActiveTab(item);
    setMobileOpen(false);

    if (item === "Dashboard") navigate("/");
    if (item === "Trade") navigate("/trade");
    if (item === "Portfolio") navigate("/portfolio");
  };

  const handleLogout = async () => {
    try {
      logout();
    } catch (err) {
      console.error("Error logging out:", err);
    }

    navigate("/");
  };

  // Close menu when clicking outside
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center">
        {/* LEFT GROUP: Logo + Desktop Nav */}
        <div className="flex items-center gap-8">
          <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            TradeX
          </div>

          {/* Desktop Navigation */}
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

        {/* RIGHT GROUP: Avatar + Mobile Menu */}
        <div className="ml-auto flex items-center gap-4">
          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Avatar */}
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

            {menuOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-24 py-1 rounded-lg border border-primary bg-background shadow-lg">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-1 hover:bg-muted rounded-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden flex flex-col px-6 py-3 gap-2 border-t border-border bg-background">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => handleNavClick(item)}
              className={`text-left px-4 py-2 rounded-md transition-colors ${
                activeTab === item
                  ? "bg-purple-700 text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
import React, { useState } from "react";
import { useLocation } from "wouter";
import {
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  Clock,
  DollarSign,
  Settings,
  Menu,
  X,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: "Vender", icon: <ShoppingCart className="w-5 h-5" />, href: "/" },
  { label: "Pedidos", icon: <Package className="w-5 h-5" />, href: "/pedidos", badge: 3 },
  { label: "Produtos", icon: <Package className="w-5 h-5" />, href: "/produtos" },
  { label: "Catálogo Online", icon: <BarChart3 className="w-5 h-5" />, href: "/catalogo" },
  { label: "Clientes", icon: <Users className="w-5 h-5" />, href: "/clientes" },
  { label: "Histórico", icon: <Clock className="w-5 h-5" />, href: "/historico" },
  { label: "Finanças", icon: <DollarSign className="w-5 h-5" />, href: "/financas" },
  { label: "Estatísticas", icon: <BarChart3 className="w-5 h-5" />, href: "/estatisticas" },
  { label: "Usuários", icon: <Users className="w-5 h-5" />, href: "/usuarios" },
  { label: "Configurações", icon: <Settings className="w-5 h-5" />, href: "/configuracoes" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (href: string) => {
    navigate(href);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
    <aside
  className={cn(
    "fixed inset-y-0 left-0 z-50 w-64 bg-purple-500 text-white transition-transform duration-300 lg:relative lg:translate-x-0",
    sidebarOpen ? "translate-x-0" : "-translate-x-full"
  )}
>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center font-bold">
                T
              </div>
              <span className="font-semibold text-sm">Flypi</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-slate-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  location === item.href
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-700/50"
                )}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-slate-700 p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-slate-300 hover:bg-slate-700"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Ajuda</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-slate-300 hover:bg-slate-700"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Vender</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <HelpCircle className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                LU
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">Luquinhas</p>
                <p className="text-gray-500 text-xs">lucasdasilvapastor...</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}


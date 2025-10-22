import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import VendorPage from "./pages/VendorPage";
import PedidosPage from "./pages/PedidosPage";
import ProdutosPage from "./pages/ProdutosPage";
import CatalogoPage from "./pages/CatalogoPage";
import ClientesPage from "./pages/ClientesPage";
import HistoricoPage from "./pages/HistoricoPage";
import FinancasPage from "./pages/FinancasPage";
import EstatisticasPage from "./pages/EstatisticasPage";
import UsuariosPage from "./pages/UsuariosPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={VendorPage} />
      <Route path={"/pedidos"} component={PedidosPage} />
      <Route path={"/produtos"} component={ProdutosPage} />
      <Route path={"/catalogo"} component={CatalogoPage} />
      <Route path={"/clientes"} component={ClientesPage} />
      <Route path={"/historico"} component={HistoricoPage} />
      <Route path={"/financas"} component={FinancasPage} />
      <Route path={"/estatisticas"} component={EstatisticasPage} />
      <Route path={"/usuarios"} component={UsuariosPage} />
      <Route path={"/configuracoes"} component={ConfiguracoesPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <DashboardLayout>
            <Router />
          </DashboardLayout>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;


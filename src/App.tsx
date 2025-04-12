
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import PPEManagement from "./pages/PPEManagement";
import Accidents from "./pages/Accidents";
import Trainings from "./pages/Trainings";
import Inspections from "./pages/Inspections";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/documentos" element={<AppLayout><Documents /></AppLayout>} />
          <Route path="/epis" element={<AppLayout><PPEManagement /></AppLayout>} />
          <Route path="/treinamentos" element={<AppLayout><Trainings /></AppLayout>} />
          <Route path="/acidentes" element={<AppLayout><Accidents /></AppLayout>} />
          <Route path="/inspecoes" element={<AppLayout><Inspections /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

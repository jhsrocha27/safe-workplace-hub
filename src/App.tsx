
import { Toaster } from "@/components/ui/toaster";
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
import Communications from "./pages/Communications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { useState } from "react";
import { InspectionDetails } from "./pages/InspectionDetails";

function App() {
  // Create QueryClient instance using useState to ensure it's only created once
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/documentos" element={<AppLayout><Documents /></AppLayout>} />
            <Route path="/epis" element={<AppLayout><PPEManagement /></AppLayout>} />
            <Route path="/treinamentos" element={<AppLayout><Trainings /></AppLayout>} />
            <Route path="/acidentes" element={<AppLayout><Accidents /></AppLayout>} />
            <Route path="/inspecoes" element={<AppLayout><Inspections /></AppLayout>} />
            <Route path="/inspecoes/:id" element={<AppLayout><InspectionDetails /></AppLayout>} />
            <Route path="/comunicacoes" element={<AppLayout><Communications /></AppLayout>} />
            <Route path="/configuracoes" element={<AppLayout><Settings /></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

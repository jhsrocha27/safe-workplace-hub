
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { 
  FileText, 
  Shield, 
  BookOpen, 
  Bell, 
  ClipboardCheck,
  AlertTriangle,
  BarChart4,
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      url: '/',
      icon: BarChart4,
    },
    {
      title: 'Documentos Legais',
      url: '/documentos',
      icon: FileText,
    },
    {
      title: 'Gestão de EPIs',
      url: '/epis',
      icon: Shield,
    },
    {
      title: 'Treinamentos',
      url: '/treinamentos',
      icon: BookOpen,
    },
    {
      title: 'Comunicações',
      url: '/comunicacoes',
      icon: Bell,
    },
    {
      title: 'Inspeções',
      url: '/inspecoes',
      icon: ClipboardCheck,
    },
    {
      title: 'Acidentes',
      url: '/acidentes',
      icon: AlertTriangle,
    },
    {
      title: 'Configurações',
      url: '/configuracoes',
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4">
          <h1 className="text-2xl font-bold flex items-center text-safety-blue">
            <Shield className="mr-2" />
            SafeWork
          </h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={cn(
                    location.pathname === item.url ? "bg-blue-100 text-safety-blue" : ""
                  )}>
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

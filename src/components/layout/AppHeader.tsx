
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, Check, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

// Mock notifications data
const initialNotifications = [
  {
    id: 1,
    title: 'Novo acidente registrado',
    description: 'Um novo acidente foi registrado na obra Construção SP.',
    time: '10 minutos atrás',
    read: false,
    type: 'accident'
  },
  {
    id: 2,
    title: 'Inspeção agendada',
    description: 'Inspeção de segurança agendada para amanhã às 10:00.',
    time: '2 horas atrás',
    read: false,
    type: 'inspection'
  },
  {
    id: 3,
    title: 'Treinamento expirado',
    description: 'O treinamento de Carlos Pereira expira em 3 dias.',
    time: '5 horas atrás',
    read: false,
    type: 'training'
  }
];

export function AppHeader() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    toast({
      title: "Notificação marcada como lida",
      description: "A notificação foi marcada como lida com sucesso.",
    });
  };
  
  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    toast({
      title: "Notificação removida",
      description: "A notificação foi removida com sucesso.",
    });
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    toast({
      title: "Todas notificações lidas",
      description: "Todas as notificações foram marcadas como lidas.",
    });
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
    toast({
      title: "Notificações limpas",
      description: "Todas as notificações foram removidas.",
    });
    setIsOpen(false);
  };
  
  const getNotificationBgColor = (type: string, read: boolean) => {
    if (read) return "bg-gray-50";
    
    switch(type) {
      case 'accident':
        return "bg-red-50";
      case 'inspection':
        return "bg-blue-50";
      case 'training':
        return "bg-amber-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Pesquisar..."
            className="w-[240px] rounded-md border border-gray-200 bg-gray-50 pl-8 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-safety-orange text-white">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-medium">Notificações</h3>
                <div className="flex gap-2">
                  {notifications.length > 0 && (
                    <>
                      <Button 
                        onClick={markAllAsRead} 
                        variant="ghost" 
                        size="sm"
                        className="h-8 text-xs"
                      >
                        Marcar todas como lidas
                      </Button>
                      <Button 
                        onClick={clearAllNotifications} 
                        variant="ghost" 
                        size="sm"
                        className="h-8 text-xs"
                      >
                        Limpar todas
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-gray-500">
                    <p>Não há notificações</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={cn(
                        "p-3 border-b last:border-0",
                        getNotificationBgColor(notification.type, notification.read)
                      )}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm">
                          {notification.title}
                          {!notification.read && <div className="inline-block w-2 h-2 ml-2 bg-safety-orange rounded-full"></div>}
                        </h4>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => dismissNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{notification.description}</p>
                      <div className="text-xs text-gray-400 mt-1">{notification.time}</div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-2 border-t">
                <Button variant="link" size="sm" className="w-full">
                  Ver todas as notificações
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <Avatar>
          <div className="bg-white text-black border border-gray-200 grid place-items-center text-lg font-semibold h-full">
            TS
          </div>
        </Avatar>
      </div>
    </header>
  );
}


import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function AppHeader() {
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
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-safety-orange text-white">3</Badge>
        </div>
        <Avatar>
          <div className="bg-safety-blue text-white grid place-items-center text-lg font-semibold h-full">
            TS
          </div>
        </Avatar>
      </div>
    </header>
  );
}

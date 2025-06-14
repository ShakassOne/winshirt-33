
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, Trash2 } from 'lucide-react';
import { useUnlockSystem } from '@/hooks/useUnlockSystem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const UnlockButton: React.FC = () => {
  const { clearAllCache, forceRefreshAll, diagnoseStuckQueries } = useUnlockSystem();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <AlertTriangle className="h-4 w-4" />
          Déblocage
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={forceRefreshAll}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser tout
        </DropdownMenuItem>
        <DropdownMenuItem onClick={diagnoseStuckQueries}>
          <AlertTriangle className="h-4 w-4 mr-2" />
          Diagnostiquer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={clearAllCache} className="text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          Reset complet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UnlockButton;

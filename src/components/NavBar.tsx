
import { Button } from "@/components/ui/button";
import { TicketIcon, ClipboardList, BarChart2 } from "lucide-react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-2">
        <TicketIcon className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl">Sistema de Chamados</span>
      </div>
      
      <nav className="hidden md:flex items-center space-x-4">
        <NavLink 
          to="/tickets" 
          className={({ isActive }) => 
            isActive 
              ? "text-primary font-medium" 
              : "text-muted-foreground hover:text-foreground"
          }
        >
          Chamados
        </NavLink>
        <NavLink 
          to="/create-ticket" 
          className={({ isActive }) => 
            isActive 
              ? "text-primary font-medium" 
              : "text-muted-foreground hover:text-foreground"
          }
        >
          Novo Chamado
        </NavLink>
        <NavLink 
          to="/logs" 
          className={({ isActive }) => 
            isActive 
              ? "text-primary font-medium" 
              : "text-muted-foreground hover:text-foreground"
          }
        >
          Histórico
        </NavLink>
      </nav>
      
      <div className="flex md:hidden">
        <Button variant="ghost" size="icon">
          <ClipboardList className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default NavBar;

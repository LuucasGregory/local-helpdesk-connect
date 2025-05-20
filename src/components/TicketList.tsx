
import { useState, useEffect } from "react";
import { ticketService } from "@/services/ticketService";
import { Ticket, TicketStatus } from "@/types/ticket";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import TicketStatusBadge from "./TicketStatusBadge";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const TicketList = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<TicketStatus | "all">("all");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch tickets on component mount and whenever a ticket is updated
    const fetchTickets = () => {
      const allTickets = ticketService.getTickets();
      setTickets(allTickets);
    };
    
    fetchTickets();
    
    // Check for updates every few seconds (simulating socket updates)
    const intervalId = setInterval(fetchTickets, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  const getFilteredTickets = () => {
    if (filter === "all") return tickets;
    return tickets.filter(ticket => ticket.status === filter);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: ptBR
      });
    } catch (e) {
      return "Data desconhecida";
    }
  };

  const filteredTickets = getFilteredTickets();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter("all")}
          >
            Todos
          </Button>
          <Button 
            variant={filter === TicketStatus.OPEN ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter(TicketStatus.OPEN)}
          >
            Abertos
          </Button>
          <Button 
            variant={filter === TicketStatus.PENDING ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter(TicketStatus.PENDING)}
          >
            Em atendimento
          </Button>
          <Button 
            variant={filter === TicketStatus.RESOLVED ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter(TicketStatus.RESOLVED)}
          >
            Resolvidos
          </Button>
        </div>
        <Button onClick={() => navigate("/create-ticket")}>
          Novo chamado
        </Button>
      </div>

      {filteredTickets.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent>
            <p className="text-muted-foreground">Nenhum chamado encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTickets.map(ticket => (
            <Card key={ticket.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg truncate" title={ticket.title}>
                    {ticket.title}
                  </CardTitle>
                  <TicketStatusBadge status={ticket.status} />
                </div>
                <CardDescription className="flex justify-between items-center mt-1">
                  <span>{ticket.name} - {ticket.sector}</span>
                  <span className="text-xs">{formatDate(ticket.createdAt)}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2 flex-grow">
                <p className="text-sm line-clamp-3">{ticket.description}</p>
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                >
                  Ver detalhes
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketList;

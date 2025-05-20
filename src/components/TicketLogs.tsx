
import { useEffect, useState } from "react";
import { ticketService } from "@/services/ticketService";
import { Ticket } from "@/types/ticket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TicketStatusBadge from "./TicketStatusBadge";

const TicketLogs = () => {
  const [logs, setLogs] = useState<Ticket[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch logs
    const fetchLogs = () => {
      try {
        const ticketLogs = ticketService.getLogs();
        setLogs(ticketLogs);
      } catch (error) {
        console.error("Error fetching ticket logs:", error);
      }
    };
    
    fetchLogs();
    
    // Check for updates periodically
    const intervalId = setInterval(fetchLogs, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (e) {
      return "Data desconhecida";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/tickets")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Histórico de Chamados Resolvidos</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Registros de Chamados Finalizados</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum chamado foi resolvido ainda.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Data de abertura</TableHead>
                  <TableHead>Data de resolução</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className="cursor-pointer" onClick={() => navigate(`/tickets/${log.id}`)}>
                    <TableCell className="font-medium">{log.title}</TableCell>
                    <TableCell>{log.name}</TableCell>
                    <TableCell>{log.sector}</TableCell>
                    <TableCell>{formatDate(log.createdAt)}</TableCell>
                    <TableCell>{formatDate(log.resolvedAt)}</TableCell>
                    <TableCell>
                      <TicketStatusBadge status={log.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketLogs;

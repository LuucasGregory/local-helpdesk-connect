
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ticketService } from "@/services/ticketService";
import { Ticket, TicketStatus } from "@/types/ticket";
import TicketStatusBadge from "./TicketStatusBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, CheckCircle, Clock, Pencil } from "lucide-react";

const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchTicket = () => {
      try {
        const foundTicket = ticketService.getTicket(id);
        if (foundTicket) {
          setTicket(foundTicket);
        } else {
          toast({
            title: "Chamado não encontrado",
            description: "O chamado solicitado não existe ou foi removido",
            variant: "destructive"
          });
          navigate("/tickets");
        }
      } catch (error) {
        console.error("Error fetching ticket:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
    
    // Refresh ticket data periodically
    const intervalId = setInterval(fetchTicket, 5000);
    return () => clearInterval(intervalId);
  }, [id, navigate, toast]);

  const handleSubmitResponse = () => {
    if (!id || !response.trim()) return;
    
    setIsSubmitting(true);
    try {
      const updatedTicket = ticketService.respondToTicket({ message: response, ticketId: id });
      
      if (updatedTicket) {
        setTicket(updatedTicket);
        setResponse("");
        toast({
          title: "Resposta enviada",
          description: "Sua resposta foi adicionada com sucesso!"
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao enviar resposta",
        description: "Ocorreu um erro ao enviar sua resposta. Tente novamente.",
        variant: "destructive"
      });
      console.error("Error responding to ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolveTicket = () => {
    if (!id) return;
    
    try {
      const resolvedTicket = ticketService.resolveTicket(id);
      
      if (resolvedTicket) {
        setTicket(resolvedTicket);
        toast({
          title: "Chamado resolvido",
          description: "O chamado foi marcado como resolvido com sucesso!"
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao resolver chamado",
        description: "Ocorreu um erro ao finalizar o chamado. Tente novamente.",
        variant: "destructive"
      });
      console.error("Error resolving ticket:", error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (e) {
      return "Data desconhecida";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Carregando chamado...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <p>Chamado não encontrado</p>
        <Button onClick={() => navigate("/tickets")}>
          Voltar para lista de chamados
        </Button>
      </div>
    );
  }

  const isOpen = ticket.status === TicketStatus.OPEN;
  const isPending = ticket.status === TicketStatus.PENDING;
  const isResolved = ticket.status === TicketStatus.RESOLVED;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/tickets")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Detalhes do Chamado</h1>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{ticket.title}</CardTitle>
              <CardDescription className="text-sm mt-1">
                Por {ticket.name} - {ticket.sector} • {formatDate(ticket.createdAt)}
              </CardDescription>
            </div>
            <TicketStatusBadge status={ticket.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <p className="whitespace-pre-line">{ticket.description}</p>
            </div>

            {ticket.responses.length > 0 && (
              <div className="space-y-4 mt-6">
                <h3 className="font-medium">Respostas</h3>
                {ticket.responses.map(response => (
                  <div key={response.id} className="bg-muted/50 p-4 rounded-md border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">{response.author}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(response.createdAt)}</p>
                    </div>
                    <p className="whitespace-pre-line">{response.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>

        {!isResolved && (
          <CardFooter className="flex-col space-y-4">
            <div className="w-full">
              <Textarea
                placeholder="Digite sua resposta aqui..."
                value={response}
                onChange={e => setResponse(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                onClick={handleResolveTicket}
                disabled={isResolved}
                className="flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Marcar como Resolvido</span>
              </Button>
              <Button
                onClick={handleSubmitResponse}
                disabled={!response.trim() || isSubmitting || isResolved}
                className="flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4" />
                    <span>Responder</span>
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        )}
        
        {isResolved && ticket.resolvedAt && (
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Este chamado foi resolvido em {formatDate(ticket.resolvedAt)}
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default TicketDetail;

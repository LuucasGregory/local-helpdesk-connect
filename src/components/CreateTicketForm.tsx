
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ticketService } from "@/services/ticketService";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const CreateTicketForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    sector: "",
    title: "",
    description: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.sector || !formData.title || !formData.description) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para criar um chamado",
        variant: "destructive"
      });
      return;
    }
    
    try {
      ticketService.createTicket(formData);
      toast({
        title: "Chamado criado",
        description: "Seu chamado foi criado com sucesso!"
      });
      
      // Reset form and navigate to tickets list
      setFormData({ name: "", sector: "", title: "", description: "" });
      navigate("/tickets");
    } catch (error) {
      toast({
        title: "Erro ao criar chamado",
        description: "Ocorreu um erro ao criar seu chamado. Tente novamente.",
        variant: "destructive"
      });
      console.error("Error creating ticket:", error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Novo Chamado</CardTitle>
        <CardDescription>Preencha os dados abaixo para abrir um novo chamado</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Seu nome</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="Nome completo"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sector">Setor</Label>
            <Input 
              id="sector" 
              name="sector" 
              placeholder="Seu setor ou departamento"
              value={formData.sector}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Título do problema</Label>
            <Input 
              id="title" 
              name="title" 
              placeholder="Um título breve do problema"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição do problema</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Descreva o problema com detalhes"
              rows={5}
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => navigate("/tickets")}>
            Cancelar
          </Button>
          <Button type="submit">Criar chamado</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateTicketForm;

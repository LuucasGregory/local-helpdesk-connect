
import TicketList from "@/components/TicketList";
import { Card } from "@/components/ui/card";

const TicketsPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Lista de Chamados</h1>
      <TicketList />
    </div>
  );
};

export default TicketsPage;

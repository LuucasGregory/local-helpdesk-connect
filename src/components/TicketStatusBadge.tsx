
import { Badge } from "@/components/ui/badge";
import { TicketStatus } from "@/types/ticket";

interface TicketStatusBadgeProps {
  status: TicketStatus;
}

const TicketStatusBadge = ({ status }: TicketStatusBadgeProps) => {
  const getStatusDetails = () => {
    switch (status) {
      case TicketStatus.OPEN:
        return { label: "Aberto", color: "bg-status-open text-white" };
      case TicketStatus.PENDING:
        return { label: "Em atendimento", color: "bg-status-pending text-white" };
      case TicketStatus.RESOLVED:
        return { label: "Resolvido", color: "bg-status-resolved text-white" };
      default:
        return { label: "Desconhecido", color: "bg-gray-500 text-white" };
    }
  };

  const { label, color } = getStatusDetails();

  return (
    <Badge className={`${color} capitalize font-medium`}>
      {label}
    </Badge>
  );
};

export default TicketStatusBadge;

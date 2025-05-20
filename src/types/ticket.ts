
export enum TicketStatus {
  OPEN = "open",
  PENDING = "pending",
  RESOLVED = "resolved"
}

export interface Ticket {
  id: string;
  name: string;
  sector: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  responses: TicketResponse[];
  resolvedAt?: string;
}

export interface TicketResponse {
  id: string;
  message: string;
  createdAt: string;
  author: string;
}

export interface CreateTicketForm {
  name: string;
  sector: string;
  title: string;
  description: string;
}

export interface ResponseForm {
  message: string;
  ticketId: string;
}

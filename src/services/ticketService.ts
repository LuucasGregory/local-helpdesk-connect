
import { Ticket, TicketStatus, CreateTicketForm, ResponseForm } from "../types/ticket";

// Local storage keys
const TICKETS_KEY = 'tickets';
const LOGS_KEY = 'ticket_logs';

class TicketService {
  // Get all tickets
  getTickets(): Ticket[] {
    const tickets = localStorage.getItem(TICKETS_KEY);
    return tickets ? JSON.parse(tickets) : [];
  }

  // Get ticket by id
  getTicket(id: string): Ticket | undefined {
    const tickets = this.getTickets();
    return tickets.find(ticket => ticket.id === id);
  }

  // Create a new ticket
  createTicket(ticketData: CreateTicketForm): Ticket {
    const tickets = this.getTickets();
    
    const newTicket: Ticket = {
      id: crypto.randomUUID(),
      name: ticketData.name,
      sector: ticketData.sector,
      title: ticketData.title,
      description: ticketData.description,
      status: TicketStatus.OPEN,
      createdAt: new Date().toISOString(),
      responses: []
    };
    
    localStorage.setItem(TICKETS_KEY, JSON.stringify([...tickets, newTicket]));
    console.log('New ticket created:', newTicket);
    return newTicket;
  }

  // Add a response to a ticket
  respondToTicket(responseData: ResponseForm, author: string = "Support"): Ticket | undefined {
    const tickets = this.getTickets();
    const ticketIndex = tickets.findIndex(ticket => ticket.id === responseData.ticketId);
    
    if (ticketIndex === -1) return undefined;
    
    const updatedTicket = {
      ...tickets[ticketIndex],
      status: TicketStatus.PENDING,
      responses: [
        ...tickets[ticketIndex].responses,
        {
          id: crypto.randomUUID(),
          message: responseData.message,
          createdAt: new Date().toISOString(),
          author
        }
      ]
    };
    
    tickets[ticketIndex] = updatedTicket;
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    
    return updatedTicket;
  }

  // Resolve a ticket
  resolveTicket(id: string): Ticket | undefined {
    const tickets = this.getTickets();
    const ticketIndex = tickets.findIndex(ticket => ticket.id === id);
    
    if (ticketIndex === -1) return undefined;
    
    const resolvedTicket = {
      ...tickets[ticketIndex],
      status: TicketStatus.RESOLVED,
      resolvedAt: new Date().toISOString()
    };
    
    tickets[ticketIndex] = resolvedTicket;
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    
    // Add to logs
    this.addToLog(resolvedTicket);
    
    return resolvedTicket;
  }

  // Add resolved ticket to logs
  private addToLog(ticket: Ticket): void {
    const logs = this.getLogs();
    logs.push(ticket);
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  }

  // Get ticket logs
  getLogs(): Ticket[] {
    const logs = localStorage.getItem(LOGS_KEY);
    return logs ? JSON.parse(logs) : [];
  }
}

export const ticketService = new TicketService();

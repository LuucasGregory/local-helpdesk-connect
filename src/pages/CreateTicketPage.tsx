
import CreateTicketForm from "@/components/CreateTicketForm";

const CreateTicketPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Criar Novo Chamado</h1>
      <CreateTicketForm />
    </div>
  );
};

export default CreateTicketPage;

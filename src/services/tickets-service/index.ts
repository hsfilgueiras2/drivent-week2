import { Ticket } from "@prisma/client";
import ticketsRepository, { CreateTicketParams } from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { notFoundError } from "@/errors";


async function getAllTypes() {
  return await ticketsRepository.findManyTypes();
}

async function getTicketByUserId(userId: number) {
  const enrollment = await enrollmentRepository.findById(userId);
  if (!enrollment) throw notFoundError();

  const ticketType = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticketType) throw notFoundError();

  return await ticketsRepository.findByEnrollmentId(enrollment.id);
}

async function createTicket(params: CreateTicket, userId: number) {
  const { ticketTypeId } = params;

  const ticketType = await ticketsRepository.findTicketTypeById(ticketTypeId);
  if (!ticketType) throw notFoundError();

  const enrollment = await enrollmentRepository.findById(userId);
  if (!enrollment) throw { name: "EnrollmentNotFound" };
  
  const createTicket: CreateTicketParams = { 
    ticketTypeId,
    enrollmentId: enrollment.id,
    status: "RESERVED"
  };

  return await ticketsRepository.insert(createTicket);
}

type CreateTicket = Omit<Ticket, "id" | "enrollmentId" | "status" | "createdAt" | "updatedAt">;

const ticketsService = {
  createTicket,
  getAllTypes,
  getTicketByUserId,
};

export default ticketsService;
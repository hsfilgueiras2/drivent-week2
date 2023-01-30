import { prisma } from "@/config";
import { Payment } from "@prisma/client";

async function findByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: { ticketId }
  });
}
async function insert(createPayment: CreatePaymentParams) {
  return prisma.payment.create({
    data: createPayment
  });
}

export type CreatePaymentParams = Omit<Payment, "id" | "createdAt" | "updatedAt">;

const paymentsRepository = {
  insert,
  findByTicketId
};

export default paymentsRepository;
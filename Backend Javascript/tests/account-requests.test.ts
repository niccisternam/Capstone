import { randomUUID } from "node:crypto";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import type {
  AccountEmailSender,
  ApprovedAccountEmail,
} from "../src/modules/account-requests/account-email.sender.js";
import { InMemoryAccountRequestRepository } from "../src/modules/account-requests/in-memory-account-request.repository.js";
import { AccountRequestService } from "../src/modules/account-requests/account-request.service.js";
import { generateTemporaryPassword } from "../src/modules/account-requests/password.js";
import { accountApprovedTemplate } from "../src/shared/email/templates/account-approved.template.js";
import { accountRejectedTemplate } from "../src/shared/email/templates/account-rejected.template.js";

class CapturingEmailSender implements AccountEmailSender {
  readonly sent: ApprovedAccountEmail[] = [];
  readonly rejected: Array<{
    recipient: string;
    name: string;
    reason: string;
  }> = [];
  fail = false;

  async sendApprovedAccount(email: ApprovedAccountEmail) {
    if (this.fail) throw new Error("Fallo SMTP simulado");
    this.sent.push(email);
  }

  async sendRejectedAccount(email: {
    recipient: string;
    name: string;
    reason: string;
  }) {
    if (this.fail) throw new Error("Fallo SMTP simulado");
    this.rejected.push(email);
  }
}

function createTestContext() {
  const repository = new InMemoryAccountRequestRepository();
  const emailSender = new CapturingEmailSender();
  const service = new AccountRequestService(repository, emailSender, {
    createId: randomUUID,
    now: () => new Date("2026-09-10T12:00:00.000Z"),
    generatePassword: () => "Temporal1!segura",
    hash: async () => "scrypt:salt:hash",
  });
  const app = createApp({
    accountRequestService: service,
    adminResolver: async () => ({
      idUsuario: randomUUID(),
      rol: "ADMINISTRADOR",
    }),
  });
  return { app, emailSender };
}

const validRequest = {
  rutEmpresa: "76.123.456-0",
  razonSocial: "Panadería Ejemplo SpA",
  rutUsuario: "12.345.678-5",
  nombre: "Ana",
  apellido: "Pérez",
  correo: "ANA@EJEMPLO.CL",
  descripcion: "Dueña de la panadería",
};

describe("account requests", () => {
  it("generates unique temporary passwords that meet the authentication rules", () => {
    const generated = new Set<string>();
    for (let sample = 0; sample < 100; sample += 1) {
      const password = generateTemporaryPassword();
      expect(password.length).toBeGreaterThanOrEqual(12);
      expect(password).toMatch(/[a-z]/);
      expect(password).toMatch(/[A-Z]/);
      expect(password).toMatch(/\d/);
      expect(password).toMatch(/[^A-Za-z0-9]/);
      generated.add(password);
    }
    expect(generated.size).toBe(100);
  });

  it("builds approval and rejection emails with the required information", () => {
    const approved = accountApprovedTemplate("Ana", "Temporal1!segura");
    const rejected = accountRejectedTemplate(
      "Ana",
      "El RUT no pudo verificarse",
    );

    expect(approved.subject).toContain("aprobada");
    expect(approved.text).toContain("Ana");
    expect(approved.text).toContain("Temporal1!segura");
    expect(approved.text).toContain("cambiar esta contraseña");
    expect(rejected.subject).toContain("rechazada");
    expect(rejected.text).toContain("El RUT no pudo verificarse");
  });

  it("creates a normalized pending request", async () => {
    const { app } = createTestContext();
    const response = await request(app)
      .post("/api/v1/account-requests")
      .send(validRequest);

    expect(response.status).toBe(201);
    expect(response.body.solicitud).toMatchObject({
      rutEmpresa: "76123456-0",
      razonSocial: "Panadería Ejemplo SpA",
      rutUsuario: "12345678-5",
      correo: "ana@ejemplo.cl",
      estado: "PENDIENTE",
      motivoRechazo: null,
    });
  });

  it("rejects an invalid RUT", async () => {
    const { app } = createTestContext();
    const response = await request(app)
      .post("/api/v1/account-requests")
      .send({ ...validRequest, rutUsuario: "12.345.678-9" });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("prevents duplicate pending requests by RUT or email", async () => {
    const { app } = createTestContext();
    await request(app).post("/api/v1/account-requests").send(validRequest);
    const response = await request(app)
      .post("/api/v1/account-requests")
      .send(validRequest);

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("ACCOUNT_REQUEST_DUPLICATE");
  });

  it("keeps administration endpoints closed without authentication", async () => {
    const app = createApp();
    const response = await request(app).get("/api/v1/account-requests");

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("AUTHENTICATION_REQUIRED");
  });

  it("lets an administrator list and inspect pending requests", async () => {
    const { app } = createTestContext();
    const created = await request(app)
      .post("/api/v1/account-requests")
      .send(validRequest);
    const id = created.body.solicitud.idSolicitud as string;
    const list = await request(app).get(
      "/api/v1/account-requests?estado=PENDIENTE",
    );
    const detail = await request(app).get(`/api/v1/account-requests/${id}`);

    expect(list.status).toBe(200);
    expect(list.body.solicitudes).toHaveLength(1);
    expect(detail.status).toBe(200);
    expect(detail.body.solicitud.idSolicitud).toBe(id);
  });

  it("approves a request, creates the company and user, and emails the temporary password", async () => {
    const { app, emailSender } = createTestContext();
    const created = await request(app)
      .post("/api/v1/account-requests")
      .send(validRequest);
    const id = created.body.solicitud.idSolicitud as string;
    const response = await request(app)
      .post(`/api/v1/account-requests/${id}/approve`)
      .send({ confirmacionSii: true });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      solicitud: { estado: "APROBADA", motivoRechazo: null },
      empresa: {
        rutEmpresa: "76123456-0",
        razonSocial: "Panadería Ejemplo SpA",
      },
      usuario: {
        correo: "ana@ejemplo.cl",
        estado: "PENDIENTE",
        debeCambiarPassword: true,
      },
      correoEnviado: true,
    });
    expect(JSON.stringify(response.body)).not.toContain("Temporal1!segura");
    expect(JSON.stringify(response.body)).not.toContain("passwordHash");
    expect(emailSender.sent).toEqual([
      {
        recipient: "ana@ejemplo.cl",
        name: "Ana",
        temporaryPassword: "Temporal1!segura",
      },
    ]);
  });

  it("prevents two pending requests for the same company", async () => {
    const { app } = createTestContext();
    await request(app).post("/api/v1/account-requests").send(validRequest);
    const response = await request(app)
      .post("/api/v1/account-requests")
      .send({
        ...validRequest,
        rutUsuario: "11.111.111-1",
        correo: "otra@ejemplo.cl",
      });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("ACCOUNT_REQUEST_DUPLICATE");
  });

  it("prevents registering another user after the company has been created", async () => {
    const { app } = createTestContext();
    const created = await request(app)
      .post("/api/v1/account-requests")
      .send(validRequest);
    await request(app)
      .post(
        `/api/v1/account-requests/${created.body.solicitud.idSolicitud as string}/approve`,
      )
      .send({ confirmacionSii: true });
    const response = await request(app)
      .post("/api/v1/account-requests")
      .send({
        ...validRequest,
        rutUsuario: "11.111.111-1",
        correo: "otra@ejemplo.cl",
      });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("COMPANY_ALREADY_REGISTERED");
  });

  it("requires confirmation of the manual SII review", async () => {
    const { app } = createTestContext();
    const created = await request(app)
      .post("/api/v1/account-requests")
      .send(validRequest);
    const id = created.body.solicitud.idSolicitud as string;
    const response = await request(app)
      .post(`/api/v1/account-requests/${id}/approve`)
      .send({ confirmacionSii: false });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects with a mandatory reason and cannot review twice", async () => {
    const { app, emailSender } = createTestContext();
    const created = await request(app)
      .post("/api/v1/account-requests")
      .send(validRequest);
    const id = created.body.solicitud.idSolicitud as string;
    const rejected = await request(app)
      .post(`/api/v1/account-requests/${id}/reject`)
      .send({ motivo: "El RUT de empresa no pudo verificarse manualmente" });
    const secondReview = await request(app)
      .post(`/api/v1/account-requests/${id}/reject`)
      .send({ motivo: "Segundo intento de rechazo" });

    expect(rejected.status).toBe(200);
    expect(rejected.body.solicitud).toMatchObject({
      estado: "RECHAZADA",
      motivoRechazo: "El RUT de empresa no pudo verificarse manualmente",
    });
    expect(secondReview.status).toBe(409);
    expect(secondReview.body.error.code).toBe(
      "ACCOUNT_REQUEST_ALREADY_REVIEWED",
    );
    expect(emailSender.rejected).toHaveLength(1);
    expect(emailSender.rejected[0]?.reason).toBe(
      "El RUT de empresa no pudo verificarse manualmente",
    );
  });

  it("keeps the review result and reports when email delivery fails", async () => {
    const { app, emailSender } = createTestContext();
    emailSender.fail = true;
    const created = await request(app)
      .post("/api/v1/account-requests")
      .send(validRequest);
    const id = created.body.solicitud.idSolicitud as string;
    const approved = await request(app)
      .post(`/api/v1/account-requests/${id}/approve`)
      .send({ razonSocial: "Panadería Ejemplo SpA", confirmacionSii: true });

    expect(approved.status).toBe(200);
    expect(approved.body.solicitud.estado).toBe("APROBADA");
    expect(approved.body.correoEnviado).toBe(false);
  });
});

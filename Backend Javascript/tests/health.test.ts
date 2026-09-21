import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app, createApp } from '../src/app.js';

describe('health endpoints', () => {
  it('reports the service as healthy', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'ok', service: 'backend-javascript' });
  });

  it('returns the documented error contract for unknown routes', async () => {
    const response = await request(app).get('/does-not-exist');

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });

  it('reports database readiness through the injected probe', async () => {
    const readyApp = createApp({ databaseProbe: async () => undefined });
    const response = await request(readyApp).get('/readiness');

    expect(response.status).toBe(200);
    expect(response.body.database).toBe('ok');
  });

  it('reports unavailable when the database probe fails', async () => {
    const unavailableApp = createApp({
      databaseProbe: async () => {
        throw new Error('database unavailable');
      },
    });
    const response = await request(unavailableApp).get('/readiness');

    expect(response.status).toBe(503);
    expect(response.body.database).toBe('error');
  });
});

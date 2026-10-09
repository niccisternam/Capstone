# ADR 0001: Express como backend principal

## Decisión

Express/TypeScript será el backend principal y FastAPI será un servicio especializado.

## Motivo

La separación mantiene en un solo lugar la autenticación, autorización, persistencia, estados y API del frontend, mientras Python concentra procesamiento documental, IA, ETL y analítica.

## Consecuencia

Existe una complejidad adicional de comunicación entre servicios. Se limita usando pocos endpoints internos, contratos JSON versionados, timeouts, correlación y una única fuente de verdad para los estados.

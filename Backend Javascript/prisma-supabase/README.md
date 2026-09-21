# Modelo Prisma para Supabase PostgreSQL — ubicación anterior

Este borrador fue integrado en la raíz del backend. La fuente canónica actual es
`../prisma/schema.prisma`, junto con `../prisma/migrations`. No realizar cambios
nuevos en esta copia histórica.

El modelo conserva las seis tablas, cinco enums, relaciones, nombres fisicos,
tipos PostgreSQL, valores predeterminados e indices simples del SQL original.

## Uso

1. Copia `.env.example` como `.env` y completa las conexiones de Supabase.
2. Instala Prisma y genera la migracion inicial.
3. Agrega el contenido de `prisma/manual-constraints.sql` al final del archivo
   `migration.sql` generado.
4. Ejecuta la migracion y genera Prisma Client.

```sh
npx prisma migrate dev --name initial
npx prisma generate
```

`prisma.config.ts` usa `DIRECT_URL` para las operaciones de Prisma CLI. La
aplicacion debe crear Prisma Client con `DATABASE_URL`.

## SQL complementario

Prisma Schema no conserva por si solo todas las reglas del SQL original. El
archivo `manual-constraints.sql` contiene:

- unicidad del correo sin distinguir mayusculas y minusculas;
- indices parciales;
- restricciones `CHECK`;
- funcion y triggers para `updated_at`;
- activacion de `pgcrypto`.

Los campos `updatedAt` incluyen tambien `@updatedAt` para que Prisma Client los
actualice. Los triggers mantienen el mismo comportamiento cuando una escritura
se realiza fuera de Prisma.

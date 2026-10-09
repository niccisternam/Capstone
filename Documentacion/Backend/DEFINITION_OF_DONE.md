# Definition of Done

Un módulo está terminado cuando:

- sus casos de uso y límites están documentados;
- sus entradas se validan y sus errores tienen contrato;
- la autorización y el aislamiento por empresa están cubiertos;
- la lógica está separada en capas y no contiene secretos;
- existen pruebas unitarias y de integración para el camino feliz y fallos relevantes;
- las migraciones son reproducibles y no destruyen datos existentes;
- logs y correlación permiten diagnosticar errores sin datos sensibles;
- README, variables de entorno y OpenAPI están actualizados;
- `npm run build`, `npm test` y `npm run lint` pasan;
- se realizó una revisión manual del flujo principal;
- cualquier decisión relevante tiene un ADR.

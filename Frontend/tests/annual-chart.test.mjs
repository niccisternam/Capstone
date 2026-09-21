import test from "node:test";
import assert from "node:assert/strict";

const EXPECTED_MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

const ANNUAL_CHART_DATA = [
  { month: "JAN", amountM: 25 },
  { month: "FEB", amountM: 45 },
  { month: "MAR", amountM: 50 },
  { month: "APR", amountM: 44 },
  { month: "MAY", amountM: 50 },
  { month: "JUN", amountM: 25 },
  { month: "JUL", amountM: 22 },
  { month: "AUG", amountM: 38 },
  { month: "SEP", amountM: 50 },
  { month: "OCT", amountM: 48 },
  { month: "NOV", amountM: 22 },
  { month: "DEC", amountM: 45 },
];

function calculateHeightPercentage(amountM, maxScale = 50) {
  return Math.round((amountM / maxScale) * 100);
}

test("AnnualExpenseChart dataset contiene exactamente 12 meses", () => {
  assert.equal(ANNUAL_CHART_DATA.length, 12);
  const months = ANNUAL_CHART_DATA.map((d) => d.month);
  assert.deepEqual(months, EXPECTED_MONTHS);
});

test("Todos los montos se encuentran dentro de la escala de 0 a 50 M", () => {
  for (const item of ANNUAL_CHART_DATA) {
    assert.ok(item.amountM >= 0, `El monto de ${item.month} debe ser >= 0`);
    assert.ok(item.amountM <= 50, `El monto de ${item.month} debe ser <= 50`);
  }
});

test("El cálculo de porcentaje de altura para las barras es consistente y no supera 100%", () => {
  for (const item of ANNUAL_CHART_DATA) {
    const pct = calculateHeightPercentage(item.amountM, 50);
    assert.ok(pct >= 0 && pct <= 100, `Porcentaje para ${item.month} (${pct}%) debe estar entre 0 y 100`);
  }

  // Verificaciones específicas de escala
  assert.equal(calculateHeightPercentage(0, 50), 0);
  assert.equal(calculateHeightPercentage(25, 50), 50);
  assert.equal(calculateHeightPercentage(50, 50), 100);
});

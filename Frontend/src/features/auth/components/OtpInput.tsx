"use client";

import { useRef } from "react";
import { cleanNumericCode } from "../schemas/two-factor.schema";

export function OtpInput({
  digits,
  onChange,
  disabled,
  invalid,
}: {
  digits: string[];
  onChange: (digits: string[]) => void;
  disabled?: boolean;
  invalid?: boolean;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>, startIndex: number) => {
    event.preventDefault();

    const cleaned = cleanNumericCode(event.clipboardData.getData("text"));
    if (!cleaned) return;

    const nextDigits = [...digits];
    // Un código completo siempre se pega desde la primera casilla.
    const targetStart = cleaned.length === 6 ? 0 : startIndex;

    for (let index = 0; index < cleaned.length && targetStart + index < 6; index++) {
      nextDigits[targetStart + index] = cleaned[index];
    }

    onChange(nextDigits);

    const nextEmptyIndex = nextDigits.findIndex((digit) => digit === "");
    inputRefs.current[nextEmptyIndex !== -1 ? nextEmptyIndex : 5]?.focus();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const numericOnly = cleanNumericCode(event.target.value);
    const nextDigits = [...digits];

    if (!numericOnly) {
      nextDigits[index] = "";
      onChange(nextDigits);
      return;
    }

    // Se conserva solo el último dígito escrito en la casilla.
    nextDigits[index] = numericOnly.slice(-1);
    onChange(nextDigits);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const nextDigits = [...digits];

      if (digits[index] !== "") {
        nextDigits[index] = "";
        onChange(nextDigits);
      } else if (index > 0) {
        nextDigits[index - 1] = "";
        onChange(nextDigits);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < 5) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div
      className="flex items-center justify-start gap-2 sm:gap-3.5"
      role="group"
      aria-label="Casillas de código de verificación de 6 dígitos"
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          id={`otp-digit-${index}`}
          name={`otp-digit-${index}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          onPaste={(event) => handlePaste(event, index)}
          onChange={(event) => handleChange(event, index)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          aria-label={`Dígito ${index + 1} de 6`}
          aria-invalid={invalid}
          className={`h-12 w-11 rounded-md border-2 bg-white text-center text-xl font-bold text-slate-900 shadow-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-1 sm:h-14 sm:w-13 sm:text-2xl ${
            invalid
              ? "border-red-500 focus:border-red-500 focus:ring-red-400"
              : "border-slate-700 focus:border-blue-600 focus:ring-blue-500"
          }`}
        />
      ))}
    </div>
  );
}

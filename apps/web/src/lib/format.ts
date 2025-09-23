import currency from "currency.js";

export class CurrencyFormatter {
  public static formatBRLFromCents(amountCents: number): string {
    const value = currency(amountCents, { fromCents: true, precision: 2 });
    return value.format({
      symbol: "R$",
      separator: ".",
      decimal: ",",
      pattern: "! #",
    });
  }
}

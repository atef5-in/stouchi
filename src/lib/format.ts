// Consistent TND formatter used across the whole app.
// Uses dot as decimal separator (3 places = millimes) for international readability.
export function formatTND(amount: number, opts?: { sign?: boolean }): string {
  const abs = Math.abs(amount);
  const str = abs.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, " "); // thousands space, dot decimal
  if (opts?.sign) {
    return (amount < 0 ? "−" : "+") + str;
  }
  return str;
}

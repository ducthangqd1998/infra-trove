export function checkSize(input: string, max = 200_000) {
  if (input.length > max)
    throw new Error(
      `Input exceeds the ${max.toLocaleString('en')} character limit.`,
    );
}

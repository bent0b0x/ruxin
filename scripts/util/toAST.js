const babylon = require("babylon");

export default (input: any) =>
  babylon.parseExpression(
    input && typeof input === "string" ? `${input}` : JSON.stringify(input),
    {
      plugins: ["flow"]
    }
  );

const babylon = require("babylon");

export default (input: any, statement: boolean = false) => {
  const processedInput: string =
    input && typeof input === "string" ? `${input}` : JSON.stringify(input);
  return statement
    ? babylon.parse(processedInput, {
        plugins: ["flow"],
        sourceType: "module"
      }).program.body[0]
    : babylon.parseExpression(
        input && typeof input === "string" ? `${input}` : JSON.stringify(input),
        {
          plugins: ["flow"]
        }
      );
};

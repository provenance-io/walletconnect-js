module.exports = {
  parser: "babel",
  printWidth: 85,
  singleQuote: true,
  trailingComma: "es5",
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      options: {
        parser: "typescript",
      },
    },
  ],
};

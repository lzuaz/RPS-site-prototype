const tests = [undefined, "undefined", "", "file:./dev.db", "somethingelse"];
for (const env of tests) {
  const url = env && env !== "undefined" ? env : 'file:./dev.db';
  console.log(`env: ${env} -> url: ${url}`);
}

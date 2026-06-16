const { createClient } = require('@libsql/client');
try {
  createClient({ url: undefined });
} catch(e) {
  console.log(e);
}
try {
  createClient({ url: "undefined" });
} catch(e) {
  console.log(e);
}

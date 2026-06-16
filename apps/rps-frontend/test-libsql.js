const { createClient } = require('@libsql/client')


try {
  const libsql = createClient({
    url: 'file:./dev.db'
  })
  console.log("Success with file:./dev.db")
} catch (e) {
  console.error("Error with file:./dev.db", e.message)
}

try {
  const url = process.env.DATABASE_URL
  console.log("process.env.DATABASE_URL is:", url)
  const libsql = createClient({
    url: url
  })
  console.log("Success with process.env.DATABASE_URL")
} catch (e) {
  console.error("Error with process.env.DATABASE_URL", e.message)
}

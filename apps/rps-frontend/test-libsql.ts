import { createClient } from '@libsql/client'
try {
  const libsql = createClient({
    url: 'file:./dev.db'
  })
  console.log("Success with file:./dev.db")
} catch (e) {
  console.error("Error with file:./dev.db", e)
}

try {
  const libsql = createClient({
    url: process.env.DATABASE_URL as string
  })
  console.log("Success with process.env.DATABASE_URL")
} catch (e) {
  console.error("Error with process.env.DATABASE_URL", e)
}

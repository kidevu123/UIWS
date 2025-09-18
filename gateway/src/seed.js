// Quick seed script: run with `node src/seed.js` inside gateway container (one time)
import bcrypt from "bcryptjs";
import pkg from "pg";
const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const users = [
  {
    email: process.env.USER_ONE_EMAIL, name: process.env.USER_ONE_NAME,
    role: process.env.USER_ONE_ROLE || "her", greeting: process.env.USER_ONE_GREETING || "Hello Gorgeous",
    password: process.env.USER_ONE_PASSWORD
  },
  {
    email: process.env.USER_TWO_EMAIL, name: process.env.USER_TWO_NAME,
    role: process.env.USER_TWO_ROLE || "him", greeting: process.env.USER_TWO_GREETING || "Hey Handsome",
    password: process.env.USER_TWO_PASSWORD
  },
];

const run = async () => {
  const client = await pool.connect();
  try{
    for(const u of users){
      if(!u.email || !u.password) continue;
      const hash = await bcrypt.hash(u.password, 10);
      await client.query(
        `INSERT INTO users (email,password_hash,display_name,role,greeting)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (email) DO NOTHING`,
        [u.email.toLowerCase(), hash, u.name, u.role, u.greeting]
      );
    }
    console.log("Seed complete.");
  } finally {
    client.release();
  }
};
run().then(()=>process.exit(0));

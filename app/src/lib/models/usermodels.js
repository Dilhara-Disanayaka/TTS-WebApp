import query from '@/app/lib/db';
import bcrypt from 'bcrypt';
const findUserByEmail = async (email) => {
  console.log("Finding user by email:", email);
  const result = await query('SELECT * FROM users WHERE username = $1', [email]);
  console.log("User found:", result.rows[0]); // ✅ Logs full user info
  return result.rows[0]; // ✅ Returns the first user row
};

const createUser = async (email, password) => {
  console.log("Creating user with email:", email, password);
  try{
  const result = await query('INSERT INTO users (username, password) VALUES ($1, $2)', [email, password]);
  console.log("User created successfully:");
  return {message:"User created successfully"};
  }catch(error){
    console.error("Error creating user:", error);
    return {message:"Internal server error"};
  }
}
export default {
  findUserByEmail,
  createUser
};

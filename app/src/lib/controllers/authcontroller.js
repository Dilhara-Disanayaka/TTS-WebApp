
import { cookies } from "next/headers";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import usermodel from "@/app/lib/models/usermodels";

const loginuser=async(user)=>{
     const { email, password } = user;
     if (!email || !password) {
        return { message: "Email and password are required" , status: 400 };
     }
     try{
        console.log("Login attempt for user:", email);
        const user=await usermodel.findUserByEmail(email)
        if(user){
            const isMatch=await bcrypt.compare(password,user.password)
            if(isMatch) {
                console.log("Password match for user:", email);
                const payload={
                    id:user.id,
                    email:user.username
                }
                const accessToken=JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
                const refreshToken=JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
                console.log(refreshToken,accessToken)
                return { accessToken, refreshToken,id: user.id  ,status: 200 };

            }else{
                return { message: "Invalid password" , status: 401 };
            }

        }else{
            console.log("User not found:", email);
            // Return a 404 response if the user is not found
            return { message: "User not found" }, { status: 404 };
        }

     }catch(error){
        console.error("Login failed:", error);
        return { message: "Login failed" }, { status: 500 };
     }
}

const registeruser=async(user)=>{

    const{email,password}=user;
    if (password.length < 6) {
        return { message: "Password must be at least 6 characters long" };
    }
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
    if (!strongPasswordRegex.test(password)) {
          return { message: "Password must include at least one uppercase letter, one number, and one special character." };
    }
  

  // Proceed with user creation or next step...
  try {
    const existingUser = await usermodel.findUserByEmail(email)
    if (existingUser) {
      console.log("Email already in use:", email);
      return { message: 'Email already in use' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const response = await usermodel.createUser(email, hashedPassword)


    return ({ message: response.message });

  } catch (error) {
    console.error('Error creating user:', error)
    return ({ message: 'Internal server error' }, { status: 500 })
  }
}
export default { loginuser, registeruser };
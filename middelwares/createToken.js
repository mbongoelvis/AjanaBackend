import jwt from "jsonwebtoken"
export const createToken = async (userId, role) => { 
          try {
          // create a token using the userId and role
          const token = jwt.sign(
          { userId, role },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1d" }
          )
          return token
          } catch (error) {
          throw new Error("Error creating token")
          }
}
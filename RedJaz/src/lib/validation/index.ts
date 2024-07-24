import { z } from "zod"

export const SingupValidation = z.object({
    name: z.string().min(2,{ message: "Name must be at least 2 characters long" }),
    username: z.string().min(2,{ message: "Username must be at least 2 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6,{ message: "Password must be at least 6 characters long" }),
  })
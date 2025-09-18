import z from "zod";

const formSchemaSignUp = z.object({
  email: z.string().email("Please enter a valid email address.").regex(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/),
  password: z.string().min(6, {message: "Password must be at least 6 characters."}).max(30, {message: "Password is too long."}),
});

export type FormSchemaSignUp = z.infer<typeof formSchemaSignUp>;

export { formSchemaSignUp };


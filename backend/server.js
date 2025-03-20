import express from "express";
import cors from "cors";
import { supabase } from "./supabase.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins (or specific origins)
app.use(cors());

app.use(express.json()); // To parse incoming JSON requests

async function fetchAllUsers() {
  const { data, error } = await supabase.from("users").select("*");

  // Check for errors while fetching users
  if (error) {
    console.log("Error fetching users:", error.message);
  } else {
    console.log("Fetched users:", data); // Log the fetched user data for debugging
  }
}

// Fetch users when the server starts
fetchAllUsers();

app.post("/register", async (req, res) => {
  const { name, password } = req.body;

  // Query for a user by name
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("id")
    .eq("name", name); // No need to use .single(), we will handle multiple rows

  // Handle database fetch error
  if (fetchError) {
    console.log("Error fetching user:", fetchError.message);
    return res
      .status(500)
      .json({ error: "Internal server error while fetching user." });
  }

  // If user already exists, return an error
  if (existingUser && existingUser.length > 0) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Insert new user into the database
  const { data, error } = await supabase.from("users").insert([
    {
      name,
      password,
      is_admin: false, // Default value for is_admin
      created_at: new Date(), // Ensure created_at is set properly
    },
  ]);

  // Handle error in insert
  if (error) {
    console.log("Error inserting user:", error.message);
    return res
      .status(500)
      .json({ error: "Internal server error during registration." });
  }

  // Respond with success message and user data
  res.status(201).json({ message: "User registered successfully", user: data });
});

app.post("/login", async (req, res) => {
  const { name, password } = req.body;

  console.log("Login attempt:", { name, password });

  const { data: user, error } = await supabase
    .from("users")
    .select("id, name, password, is_admin")
    .eq("name", name) // Checking by name (consider uniqueness)
    .single(); // This expects only one result

  if (error || !user) {
    console.log("Login failed: User not found or error in query");
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  if (password === user.password) {
    console.log("Login successful for user:", user.name);
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { id: user.id, name: user.name, is_admin: user.is_admin },
    });
  } else {
    console.log("Login failed: Incorrect password");
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

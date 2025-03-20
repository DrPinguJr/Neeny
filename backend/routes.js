// routes.js
import { Router } from "express";
import { supabase } from "./supabase.js";

const router = Router();

// Fetch contributions data
router.get("/contributions", async (req, res) => {
  const { data, error } = await supabase
    .from("money")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching contributions:", error.message);
    return res.status(500).json({ error: "Error fetching contributions" });
  }

  res.status(200).json(data);
});

// Add a new contribution
router.post("/contributions", async (req, res) => {
  const { name, amount, reason } = req.body;

  if (!name || !amount || isNaN(amount)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const { data, error } = await supabase.from("money").insert([
    {
      name,
      amount,
      reason,
      created_at: new Date(),
    },
  ]);

  if (error) {
    return res.status(500).json({ error: "Error adding contribution" });
  }

  res.status(201).json({ message: "Contribution added successfully", data });
});

// Register user route
router.post("/register", async (req, res) => {
  const { name, password } = req.body;
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("id")
    .eq("name", name);

  if (fetchError) {
    console.log("Error fetching user:", fetchError.message);
    return res.status(500).json({ error: "Internal server error" });
  }

  if (existingUser && existingUser.length > 0) {
    return res.status(400).json({ error: "User already exists" });
  }

  const { data, error } = await supabase.from("users").insert([
    {
      name,
      password,
      is_admin: false,
      created_at: new Date(),
    },
  ]);

  if (error) {
    console.log("Error inserting user:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }

  res.status(201).json({ message: "User registered successfully", user: data });
});

// Login user route
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  console.log("Login attempt:", { name, password }); // Log login attempt

  // Fetch user by name
  const { data: user, error } = await supabase
    .from("users")
    .select("id, name, password, is_admin")
    .eq("name", name)
    .single(); // Expecting only one user to match

  // Log the result of the query
  console.log("Fetched user:", user);

  if (error || !user) {
    console.log("Login failed: User not found or error in query");
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  // Compare the passwords (check if they match)
  console.log("Database password:", user.password); // Log the fetched password

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

// Fetch all user names
router.get("/users", async (req, res) => {
  try {
    // Fetch users' names from the 'users' table
    const { data, error } = await supabase.from("users").select("name"); // Select only the 'name' field

    if (error) {
      console.error("Error fetching user names:", error.message);
      return res.status(500).json({ error: "Error fetching user names" });
    }

    // Return the names in the response
    const names = data.map((user) => user.name); // Extract only the names
    res.status(200).json({ names });
  } catch (error) {
    console.error("Error in /users route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

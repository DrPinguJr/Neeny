// server.js
import express from "express";
import cors from "cors";
import routes from "./routes.js"; // Import routes
import { supabase } from "./supabase.js"; // Import supabase client

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Use the routes from routes.js
app.use("/api", routes); // All routes are now prefixed with /api

// Fetch all user names when the server starts
async function fetchAllUsers() {
  try {
    const { data, error } = await supabase.from("users").select("name"); // Fetch names from users table

    if (error) {
      console.error("Error fetching user names:", error.message);
      return;
    }

    console.log("Fetched users:");
    data.forEach((user) => {
      console.log(user.name); // Log each user's name
    });
  } catch (error) {
    console.error("Error in fetchAllUsers:", error.message);
  }
}

// Call the function to fetch users on server start
fetchAllUsers();

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

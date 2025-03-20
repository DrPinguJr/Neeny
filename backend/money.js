import { supabase } from "./supabase.js"; // Import your Supabase client

// Fetch Contributions Data
async function fetchContributions() {
  const { data, error } = await supabase
    .from("money")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching contributions:", error.message);
    return;
  }

  // Calculate total amount
  let totalAmount = data.reduce((sum, entry) => sum + entry.amount, 0);
  document.getElementById("totalAmount").textContent = `Total Amount Saved: $${totalAmount}`;

  // Populate contributions list
  let contributionsList = document.getElementById("contributionsList");
  contributionsList.innerHTML = ""; // Clear existing entries

  data.forEach((entry) => {
    let listItem = document.createElement("li");
    listItem.className = "p-4 bg-gray-50 border rounded shadow";
    listItem.innerHTML = `
      <p class="text-lg font-semibold">${entry.name}: $${entry.amount}</p>
      <p class="text-gray-500">Reason: ${entry.reason || "No reason provided"}</p>
      <p class="text-gray-400 text-sm">${new Date(entry.created_at).toLocaleDateString()}</p>
    `;
    contributionsList.appendChild(listItem);
  });
}

// Handle Adding a New Contribution
document.getElementById("addContributionBtn").addEventListener("click", async () => {
  const name = prompt("Enter your name:");
  const amount = parseInt(prompt("Enter amount:"), 10);
  const reason = prompt("Enter reason (optional):");

  if (!name || isNaN(amount)) {
    alert("Invalid input!");
    return;
  }

  const { error } = await supabase.from("money").insert([{ name, amount, reason }]);

  if (error) {
    alert("Error adding contribution: " + error.message);
  } else {
    alert("Contribution added successfully!");
    fetchContributions(); // Refresh the list
  }
});

// Load contributions on page load
fetchContributions();

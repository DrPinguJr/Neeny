// Get references to DOM elements
const addContributionBtn = document.getElementById("addContributionBtn");
const addContributionModal = document.getElementById("addContributionModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const addContributionForm = document.getElementById("addContributionForm");
const contributionsList = document.getElementById("contributionsList");
const totalAmountElement = document.getElementById("totalAmount");

// Initialize total amount
let totalAmount = 0;

// Show the modal when "Add Contribution" button is clicked
addContributionBtn.addEventListener("click", () => {
  addContributionModal.classList.remove("hidden");
});

// Close the modal when "Close" button is clicked
closeModalBtn.addEventListener("click", () => {
  addContributionModal.classList.add("hidden");
});

// Handle form submission to add a new contribution
addContributionForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the form from submitting the default way

  // Get the values from the form fields
  const name = document.getElementById("name").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const reason = document.getElementById("reason").value;

  if (name && !isNaN(amount) && amount > 0) {
    // Add the contribution to the list
    const li = document.createElement("li");
    li.classList.add("flex", "justify-between", "items-center", "border-b", "py-2");
    li.innerHTML = `
      <span>${name} - $${amount.toFixed(2)} (${reason})</span>
      <button class="text-red-500" onclick="removeContribution(this, ${amount})">Remove</button>
    `;
    contributionsList.appendChild(li);

    // Update the total amount
    totalAmount += amount;
    totalAmountElement.textContent = `Total Amount Saved: $${totalAmount.toFixed(2)}`;

    // Clear the form fields
    addContributionForm.reset();

    // Close the modal
    addContributionModal.classList.add("hidden");
  } else {
    alert("Please enter a valid name and amount.");
  }
});

// Remove a contribution and update the total amount
function removeContribution(button, amount) {
  const li = button.closest("li");
  li.remove();

  // Update the total amount
  totalAmount -= amount;
  totalAmountElement.textContent = `Total Amount Saved: $${totalAmount.toFixed(2)}`;
}

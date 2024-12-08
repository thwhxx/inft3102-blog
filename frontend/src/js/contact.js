document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Show spinner, hide form
  document.getElementById("contactForm").style.display = "none";
  document.getElementById("spinner").style.display = "flex";

  // Get form data
  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
  };

  try {
    const response = await fetch("/.netlify/functions/contact", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      // Hide spinner, show success message
      document.getElementById("spinner").style.display = "none";
      document.getElementById("success").style.display = "block";
    } else {
      throw new Error("Failed to send message");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Sorry, there was an error sending your message. Please try again.");
    // Show form again, hide spinner
    document.getElementById("contactForm").style.display = "block";
    document.getElementById("spinner").style.display = "none";
  }
});

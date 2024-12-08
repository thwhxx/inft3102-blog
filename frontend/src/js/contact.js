document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
  };

  try {
    console.log("Sending data:", formData);
    const response = await fetch("/.netlify/functions/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    console.log("Response:", result);

    if (!response.ok) {
      throw new Error(result.message || "Error sending message");
    }

    // Hide form, show success message
    document.getElementById("contactForm").style.display = "none";
    document.getElementById("success").style.display = "block";
  } catch (error) {
    console.error("Error:", error);
    alert("Error sending message: " + error.message);
  }
});

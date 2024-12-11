document.addEventListener("DOMContentLoaded", () => {
  // Get the form element
  const form = document.getElementById("contactForm");

  // Check if form exists
  if (!form) {
    console.error("Contact form not found");
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const buttonText = submitButton.querySelector(".button-text");
  const buttonLoader = submitButton.querySelector(".button-loader");
  const statusDiv = form.querySelector(".form-status");

  const setLoading = (isLoading) => {
    submitButton.disabled = isLoading;
    buttonText.style.display = isLoading ? "none" : "block";
    buttonLoader.style.display = isLoading ? "block" : "none";
  };

  const setStatus = (message, isError = false) => {
    statusDiv.textContent = message;
    statusDiv.className = `form-status ${isError ? "error" : "success"}`;
    statusDiv.style.display = message ? "block" : "none";
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setStatus("");

      const formData = {
        data: {
          name: form.name.value,
          email: form.email.value,
          phone: form.phone.value,
          subject: form.subject.value,
          message: form.message.value,
        },
      };

      console.log("Submitting form data:", formData);

      const response = await fetch("http://localhost:1337/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      console.log("Response data:", result);

      setStatus("Thank you for your message. We will get back to you soon!");
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("Failed to submit form. Please try again.", true);
    } finally {
      setLoading(false);
    }
  });
});

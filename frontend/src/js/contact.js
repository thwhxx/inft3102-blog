// frontend/src/js/contact.js
import config from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  if (!form) {
    console.error("Contact form not found");
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const buttonText = submitButton
    ? submitButton.querySelector(".button-text")
    : null;
  const buttonLoader = submitButton
    ? submitButton.querySelector(".button-loader")
    : null;
  const statusDiv = form.querySelector(".form-status");

  const setLoading = (isLoading) => {
    if (submitButton) {
      submitButton.disabled = isLoading;
    }
    if (buttonText) {
      buttonText.style.display = isLoading ? "none" : "block";
    }
    if (buttonLoader) {
      buttonLoader.style.display = isLoading ? "block" : "none";
    }
  };

  const setStatus = (message, isError = false) => {
    if (statusDiv) {
      statusDiv.textContent = message;
      statusDiv.className = `form-status ${isError ? "error" : "success"}`;
      statusDiv.style.display = message ? "block" : "none";
    }
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

      // Updated to use Netlify function
      const response = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);

      const result = await response.json();
      console.log("Response data:", result);

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      setStatus("Thank you for your message. We will get back to you soon!");
      form.reset();
    } catch (error) {
      setStatus("Failed to submit form. Please try again.", true);
    } finally {
      setLoading(false);
    }
  });
});

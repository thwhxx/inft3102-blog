document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const spinner = document.getElementById("spinner");
    const responseMessage = document.getElementById("responseMessage");

    // Hide form and show spinner
    this.style.display = "none";
    spinner.style.display = "block";

    fetch("/your-serverless-function-endpoint", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Hide spinner and show response message
        spinner.style.display = "none";
        responseMessage.style.display = "block";
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error case
      });
  });

require("dotenv").config();
const axios = require("axios");

async function checkSetup() {
  console.log("\nChecking Strapi setup...");
  console.log("-------------------");

  // Check if .env file is loaded
  console.log("1. Environment Variables:");
  console.log("STRAPI_URL:", process.env.STRAPI_URL || "Not set");

  if (!process.env.STRAPI_URL) {
    console.error("\nError: STRAPI_URL is not set in .env file");
    console.log("Please create a .env file in your project root with:");
    console.log("STRAPI_URL=http://localhost:1337");
    return;
  }

  // Test connection to Strapi
  console.log("\n2. Testing Strapi Connection:");
  try {
    const url = `${process.env.STRAPI_URL}/api/blog-posts?populate=*`;
    console.log("Attempting to connect to:", url);

    const response = await axios.get(url);
    console.log("✓ Successfully connected to Strapi");
    console.log(`✓ Found ${response.data.data.length} posts`);
  } catch (error) {
    console.error("✗ Failed to connect to Strapi:");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      console.error("No response received. Is Strapi running?");
    } else {
      console.error("Error:", error.message);
    }
  }
}

checkSetup();

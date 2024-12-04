const axios = require("axios");
require("dotenv").config();

async function testStrapiImageApi() {
  try {
    // 1. Test basic post endpoint with image population
    const url = `${process.env.STRAPI_URL}/api/blog-posts?populate=*`;
    console.log("\n1. Testing API URL:", url);

    const response = await axios.get(url);

    // Get the first post
    const firstPost = response.data.data[0];
    console.log("\n2. First post raw data:");
    console.log(JSON.stringify(firstPost, null, 2));

    // Check image structure
    if (firstPost?.attributes?.image?.data) {
      const imageData = firstPost.attributes.image.data;
      console.log("\n3. Image data structure:");
      console.log(JSON.stringify(imageData, null, 2));

      // Construct full image URL
      const imageUrl = `${process.env.STRAPI_URL}${imageData.attributes.url}`;
      console.log("\n4. Full image URL:");
      console.log(imageUrl);

      // Test image accessibility
      try {
        const imageResponse = await axios.get(imageUrl);
        console.log("\n5. Image accessibility test:");
        console.log("✅ Image is accessible");
        console.log("Content-Type:", imageResponse.headers["content-type"]);
        console.log("Content-Length:", imageResponse.headers["content-length"]);
      } catch (imageError) {
        console.log("\n❌ Error accessing image:");
        console.log(imageError.message);
      }
    } else {
      console.log("\n❌ No image found in the first post");
    }

    // Show all available posts with their image info
    console.log("\n6. All posts summary:");
    response.data.data.forEach((post, index) => {
      console.log(`\nPost ${index + 1}:`);
      console.log(`Title: ${post.attributes.title}`);
      console.log(`Has image: ${post.attributes.image?.data ? "Yes" : "No"}`);
      if (post.attributes.image?.data) {
        console.log(
          `Image URL: ${process.env.STRAPI_URL}${post.attributes.image.data.attributes.url}`
        );
      }
    });
  } catch (error) {
    console.error("\n❌ Error testing Strapi API:");
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("Status:", error.response.status);
      console.log("Headers:", error.response.headers);
      console.log("Data:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.log("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error:", error.message);
    }
  }
}

// Run the test
console.log("🚀 Starting Strapi Image API Test...");
testStrapiImageApi()
  .then(() => console.log("\n✨ Test completed"))
  .catch((err) => console.error("\n💥 Test failed:", err));

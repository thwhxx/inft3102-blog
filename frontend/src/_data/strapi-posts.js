const axios = require("axios");
require("dotenv").config();

module.exports = async function () {
  try {
    if (!process.env.STRAPI_URL) {
      console.error("ERROR: STRAPI_URL is not defined");
      return [];
    }

    const url = `${process.env.STRAPI_URL}/api/blog-posts?populate=image`;
    const response = await axios.get(url);

    if (!response.data?.data) return [];

    const posts = response.data.data.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content || "",
      excerpt: item.excerpt || "",
      date: new Date(item.publishDate || item.publishedAt || new Date()),
      tags: Array.isArray(item.tags) ? item.tags : [],
      slug: item.slug,
      image: item.image ? {
        url: `${process.env.STRAPI_URL}${item.image.url}`,
        alternativeText: item.image.alternativeText || "",
        width: item.image.width,
        height: item.image.height,
      } : null
    })).filter(post => post.title && post.slug);

    return posts;
  } catch (error) {
    console.error("Error fetching Strapi posts:", error.message);
    return [];
  }
};
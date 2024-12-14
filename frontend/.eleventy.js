const markdownIt = require("markdown-it");
const { DateTime } = require("luxon");
const emojiReadTime = require("@11tyrocks/eleventy-plugin-emoji-readtime");
const fs = require("fs");

const csp = "default-src 'self'; style-src 'self' 'unsafe-inline';";

module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addPassthroughCopy("./src/js");
  eleventyConfig.addPlugin(emojiReadTime, { showEmoji: false });

  eleventyConfig.addFilter("md", function (content = "") {
    return markdownIt({ html: true }).render(content);
  });

  eleventyConfig.addFilter("postDate", (dateObj) => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toLocaleString(
      DateTime.DATE_MED
    );
  });

  // Add a filter to check if a post has a specific tag
  eleventyConfig.addFilter("where", function (array, key, value) {
    if (!array) return [];
    return array.filter((item) => {
      if (!Array.isArray(item[key])) return false;
      return item[key].includes(value);
    });
  });

  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!--excerpt-->",
  });

  // Strapi posts collection
  eleventyConfig.addCollection("strapiPosts", async function () {
    try {
      const strapiPosts = require("./src/_data/strapi-posts.js");
      const posts = await strapiPosts();
      return posts;
    } catch (error) {
      console.error("Error loading Strapi posts:", error);
      return [];
    }
  });

  // Tag List collection - Fixed to work with Strapi posts
  eleventyConfig.addCollection("tagList", async function (collectionApi) {
    try {
      // Get Strapi posts directly
      const strapiPosts = require("./src/_data/strapi-posts.js");
      const posts = await strapiPosts();

      // Create tag set
      const tagSet = new Set();
      posts.forEach((post) => {
        if (Array.isArray(post.tags)) {
          post.tags.forEach((tag) => tagSet.add(tag));
        }
      });

      return Array.from(tagSet).sort();
    } catch (error) {
      console.error("Error building tag list:", error);
      return [];
    }
  });

  // Tagged posts collection
  eleventyConfig.addCollection("postsByTag", async function () {
    try {
      const strapiPosts = require("./src/_data/strapi-posts.js");
      const posts = await strapiPosts();

      let tagMap = {};
      posts.forEach((post) => {
        if (Array.isArray(post.tags)) {
          post.tags.forEach((tag) => {
            if (!tagMap[tag]) {
              tagMap[tag] = [];
            }
            tagMap[tag].push(post);
          });
        }
      });

      return tagMap;
    } catch (error) {
      console.error("Error building posts by tag:", error);
      return {};
    }
  });

  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, bs) {
        bs.addMiddleware("*", (req, res) => {
          const content_404 = fs.readFileSync("dist/404.html");
          res.writeHead(404, {
            "Content-Type": "text/html; charset=UTF-8",
            "Content-Security-Policy": csp,
          });
          res.write(content_404);
          res.end();
        });
      },
    },
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      pathPrefix: "/eleventy-sample/",
    },
  };
};

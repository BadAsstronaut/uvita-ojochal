const path = require('path');
const sass = require('sass');
const navPlugin = require('@11ty/eleventy-navigation');
const { eleventyImageTransformPlugin } = require('@11ty/eleventy-img');
const fs = require('fs');

const imageConfig = {
    extensions: "html",
    formats: ["webp"],
    widths: [300, 600, 900, "auto"],
    defaultAttributes: {
        loading: "lazy",
        decoding: "async",
        sizes: "100vw",
    },
    urlPath: "/images/",
};

module.exports = function (eleventyConfig) {
    // Add plugins
    eleventyConfig.addPlugin(navPlugin);
    eleventyConfig.addPlugin(eleventyImageTransformPlugin, imageConfig);

    // Sitemap Configuration
    eleventyConfig.addGlobalData("eleventyComputed", {
        permalink: (data) => {
            // Skip drafts from sitemap
            if (data.draft) {
                return false;
            }
            return data.permalink;
        },
        eleventyExcludeFromCollections: (data) => {
            // Exclude drafts from collections
            return data.draft || data.eleventyExcludeFromCollections;
        }
    });

    // Create a collection of all pages for sitemap
    eleventyConfig.addCollection("sitemapPages", function (collectionApi) {
        return collectionApi.getAll().filter(function (item) {
            // Filter out drafts and explicitly excluded items
            return !item.data.draft && !item.data.eleventyExcludeFromCollections;
        });
    });

    // Add filters
    eleventyConfig.addFilter("limit", function (arr, limit) {
        return arr.slice(0, limit);
    });

    // Add current year filter
    eleventyConfig.addFilter('currentYear', () => {
        return new Date().getFullYear();
    });

    // Add sitemap filters
    eleventyConfig.addFilter('absoluteUrl', (url, base) => {
        try {
            return new URL(url, base).toString();
        } catch (e) {
            console.error(`Error resolving URL: ${url} with base ${base}`);
            return url;
        }
    });

    eleventyConfig.addFilter('dateToISO', (date) => {
        if (!date) return '';
        try {
            return new Date(date).toISOString();
        } catch (e) {
            console.error(`Error converting date: ${date}`);
            return '';
        }
    });

    eleventyConfig.addFilter('lastModifiedDate', (filename) => {
        try {
            const stat = fs.statSync(filename);
            return stat.mtime;
        } catch (e) {
            console.error(`Error getting last modified date for ${filename}`);
            return new Date();
        }
    });

    // Add shortcodes
    eleventyConfig.addShortcode("currentYear", () => `${new Date().getFullYear()}`);

    // Watch Sass files and assets
    eleventyConfig.addWatchTarget("./src/assets/");

    // Compile Sass
    eleventyConfig.addTemplateFormats("scss");
    eleventyConfig.addExtension("scss", {
        outputFileExtension: "css",
        compile: async function (inputContent, inputPath) {
            // Skip if it's a partial Sass file
            if (path.basename(inputPath).startsWith("_")) {
                return;
            }

            let parsed = path.parse(inputPath);
            let result;

            try {
                result = sass.compile(inputPath, {
                    loadPaths: [
                        parsed.dir,
                        "src/assets/styles",
                        "node_modules"
                    ],
                    sourceMap: true,
                    style: "expanded"
                });

                // This is important for live reloading
                this.addDependencies(inputPath, result.loadedUrls);

                return async () => {
                    return result.css;
                };
            } catch (err) {
                console.error('Sass compilation error:', err);
            }
        }
    });

    // Copy static assets
    eleventyConfig.addPassthroughCopy("src/assets/images");
    eleventyConfig.addPassthroughCopy("src/assets/js");
    eleventyConfig.addPassthroughCopy("src/assets/fonts");
    eleventyConfig.addPassthroughCopy("src/site.webmanifest");
    eleventyConfig.addPassthroughCopy("src/robots.txt");

    // Watch targets
    eleventyConfig.addWatchTarget("./src/assets/js/");

    // Base Config
    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes",
            layouts: "_includes/layouts",
            data: "_data"
        },
        templateFormats: ["njk", "md", "html"],
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk"
    };
};

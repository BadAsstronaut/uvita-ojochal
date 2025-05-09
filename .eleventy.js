const path = require('path');
const sass = require('sass');
const navPlugin = require('@11ty/eleventy-navigation');
const { eleventyImageTransformPlugin } = require('@11ty/eleventy-img');
const fs = require('fs');

// Updated image configuration with explicit output directory and better order handling
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
    outputDir: "./_site/images/", // Use _site instead of dist
    useCache: true,
    svgShortCircuit: false, // Don't skip SVG processing
    dryRun: false, // Make sure processing happens
    transformOnBuild: true, // Force transform during build
};

module.exports = function (eleventyConfig) {
    // Add plugins
    eleventyConfig.addPlugin(navPlugin);
    
    // Set up image processing first before other processes
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

    // Add language-specific collections
    eleventyConfig.addCollection("posts_en", function (collectionApi) {
        return collectionApi.getFilteredByGlob("src/posts/*.md")
            .filter(item => !item.data.locale || item.data.locale === "en");
    });

    eleventyConfig.addCollection("posts_es", function (collectionApi) {
        return collectionApi.getFilteredByGlob("src/posts/*.md")
            .filter(item => item.data.locale === "es");
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

    // Add ensureRootPath filter
    eleventyConfig.addFilter('ensureRootPath', (path) => {
        if (!path) return '';
        return path.startsWith('/') ? path : `/${path}`;
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
    eleventyConfig.addPassthroughCopy({ "src/assets/images": "assets/images" });
    eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
    eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });
    eleventyConfig.addPassthroughCopy({ "src/site.webmanifest": "site.webmanifest" });
    eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
    
    // Watch targets
    eleventyConfig.addWatchTarget("./src/assets/js/");

    // Base Config
    return {
        dir: {
            input: "src",
            output: "_site", // Use _site instead of dist
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

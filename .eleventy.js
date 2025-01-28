const path = require('path');
const sass = require('sass');
const navPlugin = require('@11ty/eleventy-navigation');
const { eleventyImageTransformPlugin } = require('@11ty/eleventy-img');

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

module.exports = function(eleventyConfig) {
    // Add plugins
    eleventyConfig.addPlugin(navPlugin);
    eleventyConfig.addPlugin(eleventyImageTransformPlugin, imageConfig);
    
    // Add filters
    eleventyConfig.addFilter("limit", function(arr, limit) {
        return arr.slice(0, limit);
    });

    // Add shortcodes
    eleventyConfig.addShortcode("currentYear", () => `${new Date().getFullYear()}`);

    // Handle SCSS
    eleventyConfig.addTemplateFormats("scss");
    eleventyConfig.addExtension("scss", {
        outputFileExtension: "css",
        
        compile: async function(inputContent, inputPath) {
            // Skip partials (files starting with _)
            let parsed = path.parse(inputPath);
            if (parsed.name.startsWith("_")) {
                return;
            }

            // Compile SCSS to CSS
            let result = sass.compileString(inputContent, {
                loadPaths: [
                    parsed.dir || ".",
                    path.join(process.cwd(), "src/assets/styles")
                ],
                sourceMap: true,
                style: "compressed"
            });

            // Ensure output directory exists
            return async () => {
                return result.css;
            };
        },

        // This controls the output directory structure
        getOutputPath: function(inputPath) {
            let parsed = path.parse(inputPath);
            // Skip partials
            if (parsed.name.startsWith("_")) {
                return false;
            }
            // Maintain directory structure but change extension
            return inputPath.replace(/^src\//, "_site/assets/styles/").replace(/\.scss$/, ".css");
        }
    });
    
    // Copy static assets
    eleventyConfig.addPassthroughCopy("src/assets/images");
    eleventyConfig.addPassthroughCopy("src/assets/js");
    eleventyConfig.addPassthroughCopy("src/assets/fonts");
    
    // Watch targets
    eleventyConfig.addWatchTarget("./src/assets/styles/");
    eleventyConfig.addWatchTarget("./src/assets/js/");
    
    // Base Config
    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes",
            layouts: "_includes",
            data: "_data"
        },
        templateFormats: ["njk", "md", "html", "scss", "css"],
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk"
    };
};

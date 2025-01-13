const path = require('path');
const navPlugin = require('@11ty/eleventy-navigation');
const { eleventyImageTransformPlugin } = require('@11ty/eleventy-img');


const imgCfg = {
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

module.exports = cfg => 
{
    cfg.metadata = {
        language: 'en',
    };

    cfg.addPlugin(navPlugin);
    cfg.addPlugin(eleventyImageTransformPlugin, imgCfg);

    cfg.addLayoutAlias('base', 'layouts/base')

    return {
        markdownTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
    };
};

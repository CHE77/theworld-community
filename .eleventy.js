module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    'src/images': 'images',
    'src/css': 'css',
    'src/js': 'js'
  });

  return {
    cleanOutputDir: true,
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      data: '_data'
    }
  };
};

'use strict';
var app = app || {};

(function(module) {
  const adminView = {
    initAdminPage : () => {
      let template = Handlebars.compile($('#author-template').text());
      // COM/MENT: What is this function doing? Where is it called? Does it call any other functions, and if so, in what file(s) do those function(s) live?
      // Taking in the data returned from numWordsByAuthor and appends that to our .author-stats then finds .articles inside #blog-stats and setting that to the totol number of articles. Then it finds .words in #blog-stats and sets it to the return value of numWordsAll which is defined in article.js, it finds the total word count for all articles for all authors.
      app.Article.numWordsByAuthor().forEach(stat => $('.author-stats').append(template(stat)));
      $('#blog-stats .articles').text(app.Article.all.length);
      $('#blog-stats .words').text(app.Article.numWordsAll());
    }
  };

  app.Article.fetchAll(adminView.initAdminPage);
  module.adminView = adminView;
})(app);

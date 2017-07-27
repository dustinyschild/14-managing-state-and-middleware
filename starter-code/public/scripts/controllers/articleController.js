'use strict';
var app = app || {};

(function(module) {
  const articleController = {};

  // COM/MENT: What is this function doing? Where is it called? Does it call any other functions, and if so, in what file(s) do those function(s) live?
  // articleController.index is being passed an argument `ctx` which is the articles, and passes `ctx.articles` into app.articleView.index
  articleController.index = (ctx) => app.articleView.index(ctx.articles);

  // REVIEW: Middleware for grabbing one article by ID:
  articleController.loadById = (ctx, next) => {
    let articleData = article => {
      ctx.articles = article;
      next();
    };

    // COM/MENT: What is this function doing? Where is it called? Does it call any other functions, and if so, in what file(s) do those function(s) live?
    // This call is making a get request /articles/find and setting the field to article_id nad the value to ctx.params.article_id, then the callback function articleData which sets ctx.articles to article(which is passed in as a parameter)
    //This function is being called here, it calls tbe articleData function which lives withing this same parent function that we are in(just above).
    app.Article.findWhere('article_id', ctx.params.article_id, articleData);
  };

  // REVIEW: Middleware for loading up articles by a certain author:
  articleController.loadByAuthor = (ctx, next) => {
    let authorData = articlesByAuthor => {
      ctx.articles = articlesByAuthor;
      next();
    };

    app.Article.findWhere('author', ctx.params.authorName.replace('+', ' '), authorData);
  };

  // REVIEW: Middleware for grabbing all articles with a certain category:
  articleController.loadByCategory = (ctx, next) => {
    let categoryData = articlesInCategory => {
      ctx.articles = articlesInCategory;
      next();
    };

    app.Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // REVIEW: Middleware for grabbing ALL articles:
  articleController.loadAll = (ctx, next) => {
    let articleData =  () => {
      ctx.articles = app.Article.all;
      next();
    };

    if (app.Article.all.length) {
      ctx.articles = app.Article.all;
      next();
    } else {
      app.Article.fetchAll(articleData);
    }
  };

  module.articleController = articleController;
})(app);

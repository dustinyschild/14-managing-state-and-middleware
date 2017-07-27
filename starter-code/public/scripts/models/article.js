'use strict';
var app = app || {};

(function(module) {
  function Article(rawDataObj) {
    Object.keys(rawDataObj).forEach(key => this[key] = rawDataObj[key]);
  }

  Article.all = [];

  // REVIEW: We no longer need our prototype toHtml() method. This functionality has been relocated to the view.
  //         As a result, Article.prototype.toHtml has been deleted.

  // REVIEW: With ES6 arrow functions, if the function only has one parameter, you don't need parentheses.
  //         This is similar to saying Article.loadAll = function(rows).
  // COM/MENT: What is this function doing? Where is it called? Does it call any other functions, and if so, in what file(s) do those function(s) live?
  //Takes the rows and sorts them by publish date, then maps them to a new Article object and stores the orderd articles in Article.all, this function uses higher order functions that are "built in" but none that we created.
  Article.loadAll = rows => {
    rows.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)));
    Article.all = rows.map(ele => new Article(ele));
  };

  // COM/MENT: What is this function doing? Where is it called? Does it call any other functions, and if so, in what file(s) do those function(s) live?
  // Does a get request for /articles to the server which selects all rows from the articles table in the database and then takes the results from the query and passes it into articles.loadall as seen above.
  Article.fetchAll = callback => {
    $.get('/articles')
      .then(
        results => {
          Article.loadAll(results);
          callback();
        }
      )
  };

  // REVIEW: We have a new method to query our DB for a specific record, based on varying criteria
  Article.findWhere = function(field, value, callback) {
    $.get('/articles/find', {field: field, val: value})
      .then(callback)
  };

  // REVIEW: A new method for gathering all of the categories
  Article.allCategories = function(callback) {
    $.get('/categories', callback);
  };

  Article.numWordsAll = () => {
    return Article.all.map(article => article.body.match(/\b\w+/g).length)
      .reduce((a, b) => a + b)
  };

  Article.allAuthors = () => {
    return Article.all.map(article => article.author)
      .reduce((names, name) => {
        if (names.indexOf(name) === -1) names.push(name);
        return names;
      }, []);
  };

  // COM/MENT: What is this function doing? Where is it called? Does it call any other functions, and if so, in what file(s) do those function(s) live?
  //for each author in article.allAuthors it is returning the name of the author as well as filtering through the articles based on the authors name and returning the total word count of them all combined.
  Article.numWordsByAuthor = () => {
    return Article.allAuthors().map(author => {
      return {
        name: author,
        numWords: Article.all.filter(a => a.author === author)
          .map(a => a.body.match(/\b\w+/g).length)
          .reduce((a, b) => a + b)
      }
    })
  };

  Article.stats = () => {
    return {
      numArticles: Article.all.length,
      numWords: Article.numWordsAll(),
      Authors: Article.allAuthors(),
    }
  };

  // COM/MENT: What is this function doing? Where is it called? Does it call any other functions, and if so, in what file(s) do those function(s) live?
  //Submits an ajax request to the server with the url /articles and method DELETE which calls a query in server.js that truncates the articles table, meaning it clears on the contents while still keeping the table. Then console logging the response.
  Article.truncateTable = callback => {
    $.ajax({
      url: '/articles',
      method: 'DELETE',
    })
      .then(console.log)
      .then(callback);
  };

  Article.prototype.insertRecord = function(callback) {
    $.post('/articles', {author: this.author, authorUrl: this.authorUrl, body: this.body, category: this.category, publishedOn: this.publishedOn, title: this.title})
      .then(console.log)
      .then(callback);
  };

  Article.prototype.deleteRecord = function(callback) {
    $.ajax({
      url: `/articles/${this.article_id}`,
      method: 'DELETE'
    })
      .then(console.log)
      .then(callback);
  };

  Article.prototype.updateRecord = function(callback) {
    $.ajax({
      url: `/articles/${this.article_id}`,
      method: 'PUT',
      data: {
        author: this.author,
        authorUrl: this.authorUrl,
        body: this.body,
        category: this.category,
        publishedOn: this.publishedOn,
        title: this.title,
        author_id: this.author_id
      }
    })
      .then(console.log)
      .then(callback);
  };

  module.Article = Article;
})(app);

'use strict';
var app = app || {};

(function(module) {
  const aboutController = {};

  // COM/MENT: What is this function doing? Where is it called? Does it call any other functions, and if so, in what file(s) do those function(s) live?
  // This shows the element with id of `about`, gets its siblings, then hides the siblings. Next it calls app.repos.requestRepos with callback function of app.repoView.index
  aboutController.index = () => {
    $('#about').show().siblings().hide();
    app.repos.requestRepos(app.repoView.index);
  };

  module.aboutController = aboutController;
})(app);

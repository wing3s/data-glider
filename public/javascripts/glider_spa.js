var app = angular.module('GliderSPA', ["xeditable", "ui.utils", "ngResource", "rzModule"]);

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});
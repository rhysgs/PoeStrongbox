var express = require('express');
var router = express.Router();

//define all routes here, js is the filename relative to the 
var routes = [
	{
		url: '/views',
		js: './views',
	},
	{
		url: '/templates',
		js: './templates',
	},
	{
		url: '/api',
		js: '../modules/PoeTradeScraper/routes'
	},
	{
		url: '/api',
		js: '../modules/Visitors/routes'
	},
  {
    url: '/',
    js: './landing'
  }
];

module.exports = function (app) {
	/*
	attach all routes to their respective url's
	*/
	for (var i = 0; i < routes.length; i++) {
		//attach route
		app.use(routes[i].url, require(routes[i].js));
	}
};
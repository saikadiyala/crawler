
    var request = require('request');
    var cheerio = require('cheerio');
    var START_URL = "https://www.freecodecamp.org/news/become-a-better-developer-by-building-projects/amp/";
    var MAX_PAGES_TO_VISIT = 10;
    
    var pagesVisited = {};
    var numPagesVisited = 0;
    var pagesToVisit = [];

    
    pagesToVisit.push(START_URL);
    crawl();
    
    function crawl() {
      if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
        console.log("Reached max limit of number of pages to visit.");
        return;
      }
      var nextPage = pagesToVisit.shift();
        visitPage(nextPage, crawl);
    }
    
    function visitPage(url, callback) {
      // Add page to our set
      pagesVisited[url] = true;
      numPagesVisited++;
    
      // Make the request
      console.log("Visiting page " + url);
      request(url, function(error, response, body) {
         // Check status code (200 is HTTP OK)
         console.log("Status code: " + response.statusCode);
         if(response.statusCode !== 200) {
           callback();
           return;
         }
         // Parse the document body
         var $ = cheerio.load(body);
   collectInternalLinks($,url);
           // In this short program, our callback is just calling crawl()
           callback();
      });
    }
    
    
    function collectInternalLinks($,url) {
     
      var absoluteLinks = $("a[href^='http']");
      console.log("Found " + absoluteLinks.length + " absolute links on page");
      absoluteLinks.each(function() {
        pagesToVisit.push($(this).attr('href'));
      });
    }

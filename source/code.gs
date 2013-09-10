//----------------------------------------------
// Google Site's Comment
//
//  PARAM_PATH_INFINITY: Path for Manage Page.
//  PAGE_GENERAL: Filename of General Page. 
//  PAGE_MANAGE: Filename of Manage Page.
//----------------------------------------------
var PARAM_PATH_INFINITY  = 'xxxxxxxxxx';
var PAGE_GENERAL = 'index.html'
var PAGE_MANAGE = 'manage.html'
var MSG_URL_INVALID = 'Invalid URL.';

function doGet(e) {
  // Logger.log("call doGet:" + e.parameter.path);

  var path;

  if (!e.parameter.path) {
    var parentUrl = SitesApp.getActivePage().getUrl();
    if (!parentUrl) {
      return setMessagePage(MSG_URL_INVALID);
      
    } else {
      var urlElements = String.split(parentUrl, "/");
      path = urlElements[urlElements.length - 2] + "/" + urlElements[urlElements.length - 1];
      
    }
    
  } else if (e.parameter.path == PARAM_PATH_INFINITY) {
    var db = ScriptDb.getMyDb();
    var instance = db.query({kind: 'comment' }).sortBy('createdAt', db.DESCENDING, db.NUMERIC).startAt(0);

    var tpl = HtmlService.createTemplateFromFile(PAGE_MANAGE);
    tpl.comments = instance;
    tpl.articlePath = e.parameter.path;
    return tpl.evaluate();       
        
  } else {
    path = e.parameter.path;
    
  }
  
  var db = ScriptDb.getMyDb();
  var instance = db.query({kind: 'comment', articlePath: path }).sortBy('createdAt', db.DESCENDING, db.NUMERIC).startAt(0);

  var tpl = HtmlService.createTemplateFromFile(PAGE_GENERAL);
  tpl.comments = instance;
  tpl.articlePath = path;
  return tpl.evaluate();        
}

function postComment(form) {
  // Logger.log("postComment:" + form);
  
  var db = ScriptDb.getMyDb();
  // Logger.log("db created");

  var comment = form.id ? db.load(form.id) : null;
  // Logger.log("form loaded");

  if (!comment || comment.kind != 'comment') {
    comment = { kind: 'comment', createdAt: +new Date };
  }
  // Logger.log("comment created");

  comment.createdBy = form.createdBy || '';
  comment.contents = form.contents || '';
  comment.articlePath = form.articlePath || '';
  // Logger.log("comment inputed" + comment.articlePath);

  var stored = db.save(comment);
  // Logger.log("db saved as " + stored.getId());

  return {
    id: stored.getId(), createdBy: stored.createdBy, contents: stored.contents,
    createdAt: dateToStr(new Date(stored.createdAt)) };
}

function fetchComment(commentId) {
  // Logger.log("fetchComment:" + commentId);

  var db = ScriptDb.getMyDb();
  var comment = db.load(commentId);
  return { createdBy:comment.createdBy, contents:comment.contents };
}

function deleteComment(commentId) {
  // Logger.log("deleteComment:" + commentId);

  if (commentId) {
    ScriptDb.getMyDb().removeById(commentId);
  }
}

function setMessagePage(msg) {
    var app = UiApp.createApplication();
    var panelMain = app.createVerticalPanel().setId('panelMain')
    .setWidth('100%')
    .setSpacing(10)
    .setStyleAttribute('background-color', '#eeeeee');
    app.add(panelMain);
    
    var labelMessage = app.createLabel()
    .setId('message')
    .setText(msg);  
    panelMain.add(labelMessage);
    
    return app;
}

function dateToStr(date) {
  // Logger.log("dateToStr:" + date);
  
  return [date.getFullYear(), date.getMonth()+1, date.getDate()].join('/') + 
         ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
}

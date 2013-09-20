//----------------------------------------------
// Google Site's Comment
//
//  PARAM_PATH_MANAGEMENT: Path for Manage Page.
//  PAGE_GENERAL: Filename of General Page. 
//  PAGE_MANAGE: Filename of Manage Page.
//----------------------------------------------
var PARAM_PATH_MANAGE  = 'eKg9l3g/g8h9flssfs3g0c';
var PAGE_GENERAL = 'index.html';
var PAGE_MANAGE = 'manage.html';
var TEXT_ANNOUNCEMENTS_PAGE_TO_ARTICLE = '記事の詳細';
var MSG_URL_INVALID = 'Invalid URL.';

function doGet(e) {
  // Logger.log("call doGet:" + e.parameter.path);
  
    if (!e.parameter.path) {
        var parentUrl = SitesApp.getActivePage().getUrl();
        var pageType = SitesApp.getActivePage().getPageType();

        if (!parentUrl) {
        
            // URL is Invalid.
            return createMessagePage(MSG_URL_INVALID);
        } else {

            // URL is Valid.
//          if (pageType == SitesApp.PageType.ANNOUNCEMENTS_PAGE) {
//            
//               // Page is Announcements Page.
//               return createLinkPage(TEXT_ANNOUNCEMENTS_PAGE_TO_ARTICLE, parentUrl);            
//            } else {
            
                /*
                 * Page is Announcement.
                 *   Get article path from url.
                 */
                var urlElements = String.split(parentUrl, "/");
                var path = urlElements[urlElements.length - 2] + "/" + urlElements[urlElements.length - 1];
                
                return createFormPage(path, PAGE_GENERAL);
//            }
        }
    } else if (e.parameter.path == PARAM_PATH_MANAGE) {

        // External Page is Management Page.
        return createFormPage(e.parameter.path, PAGE_MANAGE);        
    } else {
    
        // External Page is General Page.        
        return createFormPage(e.parameter.path, PAGE_GENERAL);            
    }
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
    createdAt: dateToStr(new Date(stored.createdAt)), articlePath: stored.articlePath };
}

function fetchComment(commentId) {
  // Logger.log("fetchComment:" + commentId);

  var db = ScriptDb.getMyDb();
  var comment = db.load(commentId);
  return { createdBy:comment.createdBy, contents:comment.contents, articlePath: comment.articlePath };
}

function deleteComment(commentId) {
  // Logger.log("deleteComment:" + commentId);

  if (commentId) {
    ScriptDb.getMyDb().removeById(commentId);
  }
}

function createFormPage(path, template) {

    var instance;

    db = ScriptDb.getMyDb();
    if (template == PAGE_MANAGE) {
        instance = db.query({kind: 'comment' }).sortBy('createdAt', db.DESCENDING, db.NUMERIC).startAt(0);
    } else {    
        instance = db.query({kind: 'comment', articlePath: path }).sortBy('createdAt', db.DESCENDING, db.NUMERIC).startAt(0);
    }
    
    var tpl = HtmlService.createTemplateFromFile(template);
    tpl.comments = instance;
    tpl.articlePath = path;
    return tpl.evaluate();       
}

function createLinkPage(text, url) {
    var app = UiApp.createApplication();
    var anchor = app.createAnchor(text, url)
    app.add(anchor);
    
    return app;
}

function createMessagePage(msg) {
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

## gscomments

This tool add a function that comment on an article by anonymity to Google Sites.

Sample: https://sites.google.com/site/flyingsawnet/mozo-s-log/googlesitesnijianyikomentojinengwozhuijia

* Outline.
  * This tool is made with google apps script.
  * I can post "contributor" and "comment" on an article by anonymity.
  * Admin can access to the Page that can update and delete comments, by setting any character string (ex. XXX) to "PARAM_PATH_INFINITY" and access to "[public URL]?path=XXX".

* How to use.
  1. On "Apps Scripts" of "Management Site", create a new script project.
     - https://developers.google.com/apps-script/managing_projects#creatingSites
  2. Set this sources (3 files), and set any character string to "PARAM_PATH_INFINITY" on code.gs.
  3. On the project, deploying this scripts as a Web App, and get a public URL.
     - https://developers.google.com/apps-script/execution_gadgets#deploying
  4. Close the project and "Management Sites".
  5. On a "Page" or a "News" article, set this public URL as "Apps Scripts".

* The remaining topics.
  * The security of the admin is low. ("PARAM_PATH_INFINITY" only).
  * Loading takes time.
  * Because I am a free account, it is displayed with "This application was created by another user, not by Google.".

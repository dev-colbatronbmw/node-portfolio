const debug = require("debug")("app:blogController");
const session = require("express-session");
require("dotenv/config");
const mysql = require("mysql");
("use strict");
const nodemailer = require("nodemailer");

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER_DATA,
  password: process.env.DATABASE_ACCESS,
  database: process.env.DATABASE
});

function getConnection() {
  return pool;
}
function getimage(url) {
  // image = `<blockquote class="imgur-embed-pub" lang="en" data-id="a/R0vMibX" data-context="false" ><a href="//imgur.com/a/R0vMibX"></a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>`;

  // debug("regex output", link);
  return url.match(/(a\/.*?)\"/i)[1];
}
function blogController() {
  debug("blog controller: ", "working");

  function getBlog(req, res) {
    debug("Get blog: ", "Working");

    var blog = [];
    var comments = [];
    var likes = [];

    getConnection().query("SELECT * FROM blog", [], function (err, rows) {
      if (err) {
        res.redirect("back");
        return;
      }

      //code modification
      blog = rows.map(row => {
        var image1 = getimage(row.image1);
        debug("image 1 ", row.image1);
        debug("image 1 after regex", image1);
        return {
          postId: row.postId,
          title: row.title,
          content: row.content,
          image1: image1,
          image2: row.image2,
          image3: row.image3,
          published: row.published,
          userId: row.userId
        };
      });

      // debug("posts in connection", blog);

      getConnection().query("SELECT * FROM blogComments", [], function (
        err,
        rows
      ) {
        if (err) {
          res.redirect("back");
          return;
        }

        //code modification
        comments = rows.map(row => {
          return {
            commentId: row.commentId,
            postId: row.postId,
            content: row.content,
            userId: row.userId
          };
        });

        getConnection().query("SELECT * FROM blogLikes", [], function (
          err,
          rows
        ) {
          if (err) {
            res.redirect("back");
            return;
          }

          //code modification
          likes = rows.map(row => {
            return {
              likeId: row.likeId,
              postId: row.postId,
              userId: row.userId
            };
          });

          // debug("posts", blog);
          // debug("comments", comments);
          // debug("likes", likes);

          if (typeof req.session.passport !== "undefined") {
            res.render("./fun/blog-index", {
              csrfToken: req.csrfToken(),
              user: req.session.passport.user,
              blog: blog,
              comments: comments,
              likes: likes
            });
          } else {
            res.render("./fun/blog-index", {
              csrfToken: req.csrfToken(),
              blog: blog,
              comments: comments,
              likes: likes
            });
          }
        });
      });
    });
  }

  function getBlogShow(req, res) {
    debug("Get blog: ", "Working");

    const postId = req.params.postId;

    getConnection().query(
      "SELECT * FROM blog WHERE postId = ?",
      [postId],
      function (err, rows) {
        if (err) {
          res.redirect("back");
          return;
        }

        //code modification
        blog = rows.map(row => {
          return {
            postId: row.postId,
            title: row.title,
            content: row.content,
            image1: row.image1,
            image2: row.image2,
            image3: row.image3,
            published: row.published,
            userId: row.userId
          };
        });

        // debug("posts in connection", blog);

        getConnection().query(
          "SELECT * FROM blogComments WHERE postId = ?",
          [postId],
          function (err, rows) {
            if (err) {
              res.redirect("back");
              return;
            }

            //code modification
            comments = rows.map(row => {
              return {
                commentId: row.commentId,
                postId: row.postId,
                content: row.content,
                userId: row.userId
              };
            });

            getConnection().query(
              "SELECT * FROM blogLikes WHERE postId = ?",
              [postId],
              function (err, rows) {
                if (err) {
                  res.redirect("back");
                  return;
                }

                //code modification
                likes = rows.map(row => {
                  return {
                    likeId: row.likeId,
                    postId: row.postId,
                    userId: row.userId
                  };
                });

                // debug("posts", blog);
                // debug("comments", comments);
                // debug("likes", likes);

                if (typeof req.session.passport !== "undefined") {
                  res.render("./fun/blog-show", {
                    csrfToken: req.csrfToken(),
                    user: req.session.passport.user,
                    blog: blog,
                    comments: comments,
                    likes: likes
                  });
                } else {
                  res.render("./fun/blog-show", {
                    csrfToken: req.csrfToken(),
                    blog: blog,
                    comments: comments,
                    likes: likes
                  });
                }
              }
            );
          }
        );
      }
    );

    // if (typeof req.session.passport !== "undefined") {
    //   res.render("./fun/blog-show", {
    //     csrfToken: req.csrfToken(),
    //     user: req.session.passport.user
    //   });
    // } else {
    //   res.render("./fun/blog-show", {
    //     csrfToken: req.csrfToken()
    //   });
    // }
  }

  return {
    getBlog,
    getBlogShow
  };
}

module.exports = blogController;

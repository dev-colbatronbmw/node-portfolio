const debug = require("debug")("app:blogController");
const session = require("express-session");
const body = require("body-parser");
require("dotenv/config");
const mysql = require("mysql");

const fs = require("fs");
("use strict");
const nodemailer = require("nodemailer");

// const pool = mysql.createPool({
//   host: process.env.HOST,
//   user: process.env.USER_DATA,
//   password: process.env.DATABASE_ACCESS,
//   database: process.env.DATABASE
// });

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
    getConnection().query("SELECT * FROM users", [], function (err, rows) {
      if (err) {
        res.redirect("back");
        return;
      }
      users = rows.map(row => {
        return {
          userId: row.Id,
          userName: row.UserName
        };
      });

      getConnection().query("SELECT * FROM blog", [], function (err, rows) {
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
          "SELECT * FROM blogComments",
          [],
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
              "SELECT * FROM blogLikes",
              [],
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
                  res.render("./fun/blog-index", {
                    csrfToken: req.csrfToken(),
                    user: req.session.passport.user,
                    users: users,
                    blog: blog,
                    comments: comments,
                    likes: likes
                  });
                } else {
                  res.render("./fun/blog-index", {
                    csrfToken: req.csrfToken(),
                    users: users,
                    blog: blog,
                    comments: comments,
                    likes: likes
                  });
                }
              }
            );
          }
        );
      });
    });
  }

  function getBlogShow(req, res) {
    debug("Get blog show page: ", "Working");

    const postId = req.params.postId;

    getConnection().query("SELECT * FROM users", [], function (err, rows) {
      if (err) {
        res.redirect("back");
        return;
      }
      users = rows.map(row => {
        return {
          userId: row.Id,
          userName: row.UserName
        };
      });

      // debug("Users: ", users);

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

                  debug("posts", blog);
                  debug("comments", comments);
                  debug("likes", likes);

                  if (typeof req.session.passport !== "undefined") {
                    res.render("./fun/blog-show", {
                      csrfToken: req.csrfToken(),
                      user: req.session.passport.user,
                      users: users,
                      blog: blog[0],
                      comments: comments,
                      likes: likes
                    });
                  } else {
                    res.render("./fun/blog-show", {
                      csrfToken: req.csrfToken(),
                      users: users,
                      blog: blog[0],
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
    });
  }
  function getEditPost(req, res) {
    debug("Get blog edit page: ", "Working");

    const postId = req.params.postId;
    getConnection().query("SELECT * FROM users", [], function (err, rows) {
      if (err) {
        res.redirect("back");
        return;
      }
      users = rows.map(row => {
        return {
          userId: row.Id,
          userName: row.UserName
        };
      });
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
          debug("blog", blog[0]);
          if (typeof req.session.passport !== "undefined") {
            res.render("./fun/blog-edit", {
              csrfToken: req.csrfToken(),
              users: users,
              user: req.session.passport.user,
              blog: blog[0]
            });
          } else {
            res.render("./fun/blog-edit", {
              users: users,
              csrfToken: req.csrfToken(),
              blog: blog[0]
            });
          }
        }
      );
    });
  }
  function getAddPost(req, res) {
    debug("add Post: ", "Working");
    if (typeof req.session.passport !== "undefined") {
      res.render("./fun/blog-add", {
        csrfToken: req.csrfToken(),
        user: req.session.passport.user
      });
    } else {
      res.render("./fun/blog-add", {
        csrfToken: req.csrfToken()
      });
    }
  }

  function postAddPost(req, res) {
    debug("add Post: ", "Working");
    // debug("title", req.body.title);
    // debug("post Content", req.body.content);
    // debug("published", req.body.published);

    const title = req.body.title;
    const content = req.body.content;
    debug("user: ", req.session.passport.user.Id);
    const userId = req.session.passport.user.Id;
    var published = 1;
    if (req.body.published !== "on") {
      published = 0;
    }
    const createdAt = Date.now();
    debug("createdAt", createdAt);
    const qString =
      "INSERT INTO blog (title, content, published, createdAt, userId) Values (?, ?, ?, ?, ?)";
    getConnection().query(
      qString,
      [title, content, published, createdAt, userId],
      (err, results, fields) => {
        if (err) {
          console.log("failed to add contact" + err);
          res.sendStatus(500);
          return;
        }
        res.redirect("/Blog");
      }
    );
  }

  function postEditPost(req, res) {
    debug("edit Post: ", "Working");
    // debug("title", req.body.title);
    // debug("post Content", req.body.content);
    // debug("published", req.body.published);

    const postId = req.params.postId;

    const title = req.body.title;
    const content = req.body.content;
    var published = 1;
    if (req.body.published !== "on") {
      published = 0;
    }

    const qString =
      "UPDATE blog SET title = ?, content = ?, published = ? WHERE postId = ? ";
    getConnection().query(
      qString,
      [title, content, published, postId],
      (err, results, fields) => {
        if (err) {
          console.log("failed to add contact" + err);
          res.sendStatus(500);
          return;
        }
        res.redirect(`/Blog/${postId}`);
      }
    );
  }

  function postAddComment(req, res) {
    debug("edit Post: ", "Working");
    // debug("title", req.body.title);
    // debug("post Content", req.body.content);
    // debug("published", req.body.published);

    const postId = req.body.postId;
    const content = req.body.newComment;
    debug("postId: ", postId);
    debug("content: ", content);
    var userId;
    if (typeof req.session.passport !== "undefined") {
      userId = req.session.passport.user.Id;
    } else {
      userId = 1;
    }
    debug("userId: ", userId);

    const qString =
      "INSERT INTO blogComments (content, postId, userId) Values (?, ?, ?)";
    getConnection().query(
      qString,
      [content, postId, userId],
      (err, results, fields) => {
        if (err) {
          console.log("failed to add contact" + err);
          res.sendStatus(500);
          return;
        }
        res.redirect(`/Blog/${postId}`);
      }
    );
  }

  function getDeletePost(req, res) {
    debug("Get delete post page: ", "Working");

    const postId = req.params.postId;
    getConnection().query("SELECT * FROM users", [], function (err, rows) {
      if (err) {
        res.redirect("back");
        return;
      }
      users = rows.map(row => {
        return {
          userId: row.Id,
          userName: row.UserName
        };
      });
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

                  debug("post to delete", blog);
                  debug("comments", comments);
                  debug("likes", likes);

                  if (typeof req.session.passport !== "undefined") {
                    res.render("./fun/blog-delete", {
                      csrfToken: req.csrfToken(),
                      users: users,
                      user: req.session.passport.user,
                      blog: blog[0],
                      comments: comments,
                      likes: likes
                    });
                  } else {
                    res.render("./fun/blog-delete", {
                      csrfToken: req.csrfToken(),
                      users: users,
                      blog: blog[0],
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
    });
  }

  function postDeletePost(req, res) {
    debug("edit Post: ", "Working");
    // debug("title", req.body.title);
    // debug("post Content", req.body.content);
    // debug("published", req.body.published);

    const postId = req.params.postId;

    const qString = "DELETE FROM blog WHERE postId = ? ";
    getConnection().query(qString, [postId], (err, results, fields) => {
      if (err) {
        console.log("failed to add contact" + err);
        res.sendStatus(500);
        return;
      }
      res.redirect("/Blog");
    });
  }
  function postRemoveLike(req, res) {
    debug("edit Post: ", "Working");
    // debug("title", req.body.title);
    // debug("post Content", req.body.content);
    // debug("published", req.body.published);

    const likeId = req.params.likeId;
    // var userId;
    // var likeId;
    // if (typeof req.session.passport !== "undefined") {
    //   userId = req.session.passport.user.Id;
    // } else {
    //   userId = 1;
    // }

    const qString = "DELETE FROM blogLikes WHERE likeId = ? ";
    getConnection().query(qString, [likeId], (err, results, fields) => {
      if (err) {
        console.log("failed to add contact" + err);
        res.redirect("back");
        return;
      }
      res.redirect("back");
    });
  }
  function postAddLike(req, res) {
    debug("edit Post: ", "Working");
    // debug("title", req.body.title);
    // debug("post Content", req.body.content);
    // debug("published", req.body.published);

    const postId = req.params.postId;

    debug("postId: ", postId);

    var userId;
    if (typeof req.session.passport !== "undefined") {
      userId = req.session.passport.user.Id;
    } else {
      userId = 1;
    }
    debug("userId: ", userId);

    const qString = "INSERT INTO blogLikes (postId, userId) Values (?, ?)";
    getConnection().query(qString, [postId, userId], (err, results, fields) => {
      if (err) {
        console.log("failed to add contact" + err);
        res.redirect("back");
        return;
      }
      res.redirect("back");
    });
  }

  return {
    getBlog,
    getAddPost,
    getBlogShow,
    getEditPost,
    postAddPost,
    postEditPost,
    getDeletePost,
    postDeletePost,
    postAddComment,
    postAddLike,
    postRemoveLike
  };
}

module.exports = blogController;

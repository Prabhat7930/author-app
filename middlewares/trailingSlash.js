const removeTrailingSlash = (req, res, next) => {
  if (req.path.substr(-1) === "/" && req.path.length > 1) {
    const newPath = req.path.slice(0, -1) + req.url.slice(req.path.length);
    res.redirect(301, newPath);
  } else {
    next();
  }
};

module.exports = removeTrailingSlash;

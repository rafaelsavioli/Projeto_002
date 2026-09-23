function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const issue = result.error.issues[0];
      const path = issue.path.join('.') || source;
      return next(new Error(`${path}: ${issue.message}`));
    }
    req[source] = result.data;
    return next();
  };
}

module.exports = { validate };

// helpers/queryHelpers.js
function queryHelpers(schema) {
  schema.query.paginate = function (page) {
    page = !page || page < 1 || isNaN(page) ? 1 : page;
    const limit = 10;
    const skip = (page - 1) * limit;
    return this.skip(skip).limit(limit);
  };

  schema.query.customSelect = function (fields) {
    if (!fields) return this;
    const modelKeys = Object.keys(this.model.schema.paths);
    const queryKeys = fields.split(" ");
    const matchKeys = queryKeys.filter((key) => modelKeys.includes(key));
    return this.select(matchKeys);
  };
}

export default queryHelpers;

// best queryHelpers
/*
function queryHelpers(schema, options = {}) {
  // Default limit, can be overridden per model
  const defaultLimit = options.defaultLimit || 10;

  // Paginate helper
  schema.query.paginate = function (page = 1, limit = defaultLimit) {
    page = isNaN(page) || page < 1 ? 1 : +page;
    limit = isNaN(limit) || limit < 1 ? defaultLimit : +limit;
    const skip = (page - 1) * limit;
    return this.skip(skip).limit(limit);
  };

  // Custom Select helper
  schema.query.customSelect = function (fields) {
    if (!fields) return this;
    const modelKeys = Object.keys(this.model.schema.paths);
    const queryKeys = fields.split(" ");
    const matchKeys = queryKeys.filter((key) => modelKeys.includes(key));
    return this.select(matchKeys);
  };

  // Sort Helper
  schema.query.applySort = function (sortBy = "createdAt", order = "desc") {
    const sortOrder = order === "asc" ? 1 : -1;
    return this.sort({ [sortBy]: sortOrder });
  };

  // Search Helper (Optional)
  schema.query.search = function (searchFields = [], keyword) {
    if (!keyword || !Array.isArray(searchFields) || searchFields.length === 0)
      return this;
    const regex = new RegExp(keyword, "i");
    return this.or(searchFields.map((field) => ({ [field]: regex })));
  };
}

*/

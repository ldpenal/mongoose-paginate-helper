/**
 * Check if param is of type 'object'.
 * @param {Any} object 
 */
const isObject = (object) => object != null
  && typeof object == 'object'
  && !Array.isArray(object);

const executeQuery = async (model, query, options = {}) => {
  const {
    limit = 1,
    lean = true,
    fieldOrdering = '_id',
    select,
    ordering = -1,
    cursor,
  } = options;

  const sortObj = isObject(fieldOrdering)
    ? fieldOrdering
    : { [fieldOrdering]: ordering };

    if (cursor) {
      const operator = ordering === -1 ? '$lte' : '$gte';
      query._id = {
        [operator]: cursor,
      }
    }

  let prepareQuery = model
    .find(query)
    .select(select)
    .sort(sortObj)
    .limit(limit + 1);

  if (lean) prepareQuery = prepareQuery.lean();

  const list = await prepareQuery;

  if (lean)
    return list.map(element => {
      element.id = element._id;
      return element;
    });

  return list.map(element => element.toObject());
};

/**
 * Pagination helper.
 * @param {Object} model Mongoose model's object, used interface of it.
 * @param {Object} query object query to perform.
 * @param {Object} options additional data
 * @param {Number} options.limit amount of results to retrieve.
 * @param {Boolean} options.lean when to perform lean queries.
 * @param {Object} options.fieldOrdering key-value pairs indicating results sorting.
 * @param {Object} options.select fields to project.
 * @param {Number} options.ordering use when _id base sorting, -1=desc 1=asc
 * @param {String} options.cursor id value from which start result retrieving.
 * @returns {Object} { list: [{}], cursor: 'string' }
 */
const pagination = async function (model, query, options) {
  const list = await executeQuery(model, query, options);

  let cursor = undefined;
  const lastElement = list[options.limit];
  if (lastElement) {
    cursor = lastElement._id;
  }

  list.pop();

  return {
    list,
    cursor,
  };
};

module.exports = pagination;
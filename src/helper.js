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

const pagination = async function (model, query, options) {
  const list = await executeQuery(model, query, options);

  let cursor = undefined;
  const lastElement = list[options.limit];
  if (lastElement) {
    const lastElement = lastElement._id;
  }

  list.pop();

  return {
    list,
    cursor,
  };
};

module.exports = pagination;
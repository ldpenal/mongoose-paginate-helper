# mongoose-paginate-helper

A simple helper to query MongoDB using a paging-like fashion.

## Loading helper

```javascript
const helper = require('mongoose-paginate-helper');
```

The `helper` identifier now contains the only exported function with function firm:

```javascript
async function (model, query, options);
```

## Arguments specification.
```javascript
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
 ```

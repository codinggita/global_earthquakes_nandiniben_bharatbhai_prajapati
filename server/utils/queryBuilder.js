'use strict';

const buildFilter = require('./filterBuilder');
const buildSort   = require('./sortBuilder');
const buildSearch = require('./searchBuilder');
const getPagination = require('./pagination');

/**
 * A reusable query builder for Mongoose models.
 * Integrates filtering, searching, sorting, and pagination.
 */
class QueryBuilder {
  /**
   * @param {Object} model - The Mongoose model (e.g., Earthquake)
   * @param {Object} queryStr - Express request query object (req.query)
   */
  constructor(model, queryStr = {}) {
    this.model = model;
    this.queryStr = queryStr;
    
    const baseFilter = buildFilter(this.queryStr);
    const searchFilter = buildSearch(this.queryStr);
    
    // Combine filters securely using $and if a search query exists
    this.filter = Object.keys(searchFilter).length > 0 
      ? { $and: [baseFilter, searchFilter] } 
      : baseFilter;
      
    this.query = this.model.find(this.filter);
  }

  /**
   * Applies sorting logic to the query.
   * @returns {QueryBuilder} this
   */
  sort() {
    const sortObj = buildSort(this.queryStr);
    this.query = this.query.sort(sortObj);
    return this;
  }

  /**
   * Applies pagination logic to the query.
   * Resolves the count query to determine total records.
   * @returns {Promise<QueryBuilder>} this
   */
  async paginate() {
    const totalRecords = await this.model.countDocuments(this.filter);
    const { skip, limit, pagination } = getPagination(this.queryStr, totalRecords);
    
    this.query = this.query.skip(skip).limit(limit);
    this.pagination = pagination;
    
    return this;
  }
}

module.exports = QueryBuilder;

/* eslint-disable no-case-declarations */
/* eslint-disable no-constant-condition */
const path = require('path');
const moment = require('moment');
const dotenv = require('dotenv');
const {
  constants: { WEEKENDS }
} = require('../constants');
const Logger = require('./logger');

dotenv.config();

/**
 * returns the status code with success response
 *
 * @function SuccessResponse
 * @param {object} data
 * @returns {object} - object for success response
 * @author dev-team
 */
const SuccessResponse = async data => {
  return { status: 'success', statusCode: 200, data };
};

/**
 * returns status code with error response
 *
 * @function ErrorResponse
 * @param {object} data
 * @returns {object} - object for error response
 * @author dev-team
 */
const ErrorResponse = async data => {
  return {
    status: 'error',
    statusCode: data && data.statusCode ? data.statusCode : 404,
    data: data && data.response ? data.response.body.message : 'No Data'
  };
};

/**
 * To find the dates between two given dates
 *
 * @function GetDates
 * @param {object} data
 * @returns {Array} - array of dates
 * @author dev-team
 */

const GetDates = (startDate, endDate) => {
  const dates = [];
  let newStartDate = moment(startDate);

  while (newStartDate < moment(endDate)) {
    if (WEEKENDS.indexOf(newStartDate.format('dddd')) < 0) {
      dates.push(newStartDate.format('YYYY-MM-DDTHH:mm:ss[Z]'));
    }
    newStartDate = moment(newStartDate).add(1, 'days');
  }

  return dates;
};

/**
 * Splits up the duration in start and end
 *
 * @function DurationSplitup
 * @param {object} opts
 * @returns {array} - returns an array of start date and end date collection
 * @author dev-team
 */
const DurationSplitup = async opts => {
  try {
    let startDate = opts.since;
    let endDate = opts.until;
    const startDateCollection = [];
    const endDateCollection = [];
    while (true) {
      startDateCollection.push(startDate);
      startDate = moment(new Date(startDate))
        .add(1, 'day')
        .utc()
        .format('YYYY-MM-DDTHH:mm:ss[Z]');
      if (startDate > opts.until) break;
    }
    while (true) {
      endDateCollection.push(endDate);
      endDate = moment(new Date(endDate))
        .add(-1, 'day')
        .utc()
        .format('YYYY-MM-DDTHH:mm:ss[Z]');
      if (endDate < opts.since) break;
    }
    endDateCollection.sort((a, b) => new Date(a) - new Date(b));
    return [startDateCollection, endDateCollection];
  } catch (exc) {
    Logger.log('error', `Error in DurationSplitup in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Data for APIs based on duration
 *
 * @function DataFormationBasedOnDuration
 * @param {object} data
 * @param {string} startDate
 * @param {string} endDate
 * @param {string} api
 * @param {object} opts
 * @returns {object} - returns data for given APIs based on duration
 * @author dev-team
 */
const DataFormationBasedOnDuration = async (data, startDate, endDate, api) => {
  try {
    // eslint-disable-next-line no-new-object
    const res = {};
    res.weekend = !!(moment(startDate).day() === 0 || moment(startDate).day() === 6);
    res.date = startDate;

    switch (api.toUpperCase()) {
      case 'THROUGHPUT':
        res.count = data.filter(dat => dat.issue_closed_at >= startDate && dat.issue_closed_at <= endDate).length;
        break;
      default:
        break;
    }
    return res;
  } catch (exc) {
    Logger.log('error', `Error in DataFormationBasedOnDuration in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

/**
 * Graph data based on duration
 *
 * @function GraphDataSplitUpByDuration
 * @param {object} data
 * @param {object} opts
 * @param {string} api
 * @returns {object} - returns graph data based on duration
 * @author dev-team
 */
const GraphDataSplitUpByDuration = async (data, opts, api = '') => {
  try {
    const [startDate, endDate] = await DurationSplitup(opts);
    const result = [];
    for (let i = 0; i < startDate.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const graphData = await DataFormationBasedOnDuration(data, startDate[i], endDate[i], api);
      result.push(graphData);
    }
    return result;
  } catch (exc) {
    Logger.log('error', `Error in GraphDataSplitUpByDuration in ${path.basename(__filename)}: ${JSON.stringify(exc)}`);
    throw exc;
  }
};

module.exports = {
  SuccessResponse,
  ErrorResponse,
  GetDates,
  GraphDataSplitUpByDuration
};

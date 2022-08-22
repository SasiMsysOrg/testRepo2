/**
 * Utility file
 */
const moment = require('moment');
const os = require('os');
const { environment } = require('../config/index');
const path = require('path');
const Logger = require('./logger');
const Retry = require('./retry')

/**
 * returns the IP address of the server instance
 *
 * @function GetInstanceHost
 * @returns {String} - IP string
 * @author dev-team
 */

const GetInstanceHost = () => {
  const hostname = os.hostname();
  Logger.log('info', `The instance hostname is ${hostname}`);
  return hostname;
};

/**
 * returns status code with success response
 *
 * @function SuccessResponse
 * @param {object} data
 * @returns {object} - object for success response
 * @author dev-team
 */

const SuccessResponse = data => {
  try {
    return { status: 'success', statusCode: '200', data };
  } catch (exc) {
    Logger.log('error', `Error in SuccessResponse in ${path.basename(__filename)}`);
    throw exc;
  }
};

/**
 * returns status code with error response
 *
 * @function ErrorResponse
 * @param {object} data
 * @returns {object} - object for error response
 * @author dev-team
 */

const ErrorResponse = data => {
  try {
    return { status: 'error', statusCode: data.statusCode, data: data.response.body.message };
  } catch (exc) {
    Logger.log('error', `Error in ErrorResponse in ${path.basename(__filename)}`);
    throw exc;
  }
};

/**
 * returns status code with failure response
 *
 * @function FailureResponse
 * @param {object} data
 * @returns {object} - object for failure response
 * @author dev-team
 */

const FailureResponse = failureType => {
  try {
    switch (failureType.toUpperCase()) {
      case 'NO_RESPONSE_FROM_DB':
        // generate alert and retry again till a limit, DB connection loose case
        Retry.checkCollection(failureType.toUpperCase())
        Logger.log('error', `Error in ErrorResponse in ${path.basename(__filename)}`);
        break;
      
        case 'PROJECT_NOT_FOUND':
        // generate alert and retry again till a limit. Check weather entry exists or not.
        Retry.checkCollection(failureType.toUpperCase())
        Logger.log('error', `Error in ErrorResponse in ${path.basename(__filename)}`);
        break;

        case 'TIME_EXPIRED':
        // generate alert and retry again till a limit. Check weather entry exists or not.
        Retry.checkCollection(failureType.toUpperCase())
        Logger.log('error', `Error in ErrorResponse in ${path.basename(__filename)}`);
        break;

        case 'JIRA_FAILURE':
        // generate alert and retry again till a limit. Check JIRA APIs.
        Retry.checkCollection(failureType.toUpperCase())
        Logger.log('error', `Error in ErrorResponse in ${path.basename(__filename)}`);
        break;

      default:
        break;
    }
    return { status: 'error', statusCode: data.statusCode, data: data.response.body.message };
  } catch (exc) {
    Logger.log('error', `Error in ErrorResponse in ${path.basename(__filename)}`);
    throw exc;
  }
};

/**
 * returns url
 *
 * @function GetUrl
 * @param {string} orgName
 * @param {string} repoName
 * @param {string} metrics
 * @param {string} value
 * @returns {string} - url
 * @author dev-team
 */

const GetUrl = (orgName, repoName, metrics, value) => {
  try {
    return `https://${environment.hostName}/${orgName}/${repoName}/${metrics}/${value}`;
  } catch (exc) {
    Logger.log('error', `Error in GetUrl in ${path.basename(__filename)}`);
    throw exc;
  }
};

/**
 * returns time
 *
 * @function GetTime
 * @param {number} time
 * @param {string} type - like hours or minutes
 * @returns {object} - object for success response
 * @author dev-team
 */

const GetTime = (time, type) => {
  try {
    return moment()
      .add(time, type)
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss[Z]');
  } catch (exc) {
    Logger.log('error', `Error in GetTime in ${path.basename(__filename)}`);
    throw exc;
  }
};

module.exports = {
  SuccessResponse,
  ErrorResponse,
  GetUrl,
  GetTime,
  GetInstanceHost,
  FailureResponse
};

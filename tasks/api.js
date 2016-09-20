'use strict';

var fs = require('fs');
var gutil = require('gulp-util');
var yargs = require('yargs');

var api = require('himation/server/api');
var surveyData = require('himation/server/data/survey');

// View the contents of an API response from a data dump
//
// This loads a survey-request data dump, which is a JSON file containing the
// POST data sent to the survey.  This data is used to generate an API request
// and display its contents.
function testApiResponse(done) {
  var rawPostData;
  var logLabel = 'test-api-response';

  try {
    rawPostData = fs.readFileSync(getSurveyData());
  } catch (e) {
    throw new gutil.PluginError(logLabel, 'You must provide the path to a survey-data file via --survey');
  }

  var postData = surveyData.convertPostDataToProfile(JSON.parse(rawPostData));
  var apiClient = api.createApiClient();
  var apiData = api.packageSurvey(postData);

  gutil.log(logLabel, 'Sending API request');
  gutil.log(logLabel, JSON.stringify(apiData, null, 2));

  apiClient.requestRecommendations(apiData)
    .catch(function(error) {
      throw new gutil.PluginError(logLabel, error);
    })
    .then(function(response) {
      gutil.log(logLabel, 'Received API response');
      gutil.log(logLabel, JSON.stringify(response, null, 2));
      done();
    });
}

/**
 * Get the absolute path to the survey data file
 *
 * @returns {string}
 * @private
 */
function getSurveyData() {
  var options = yargs
    .option('survey', {
      alias: 's',
      default: null,
      describe: 'The path to a survey dump file'
    })
    .argv;

  return options.survey;
}

module.exports = {
  testApiResponse: testApiResponse
};

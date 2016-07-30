export const DISMISS_SURVEY_ERRORS = 'DISMISS_SURVEY_ERRORS';
export const FLAG_SURVEY_ERRORS = 'FLAG_SURVEY_ERRORS';
export const SUBMIT_SURVEY = 'SUBMIT_SURVEY';

export function dismissSurveyErrors() {
  return {
    type: DISMISS_SURVEY_ERRORS
  };
}

export function flagSurveyErrors() {
  return {
    type: FLAG_SURVEY_ERRORS
  };
}

export function submitSurvey() {
  return {
    type: SUBMIT_SURVEY
  };
}

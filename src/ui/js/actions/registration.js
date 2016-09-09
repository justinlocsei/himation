import axios from 'axios';

export const BEGIN_REGISTRATION = 'BEGIN_REGISTRATION';
export const COMPLETE_REGISTRATION = 'COMPLETE_REGISTRATION';
export const REGISTER = 'REGISTER';

function completeRegistration(failed) {
  return {
    type: COMPLETE_REGISTRATION,
    error: failed
  };
}

function beginRegistration() {
  return {
    type: BEGIN_REGISTRATION
  };
}

export function register(endpoint, data) {
  return function(dispatch) {
    dispatch(beginRegistration());

    const request = {
      method: 'POST',
      data: data,
      url: endpoint
    };

    axios(request)
      .then(function(response) { dispatch(completeRegistration(response.data.error)); })
      .catch(function() { dispatch(completeRegistration(true)); });
  };
}

export const BANISH_REGISTRATION = 'BANISH_REGISTRATION';
export const DISMISS_REGISTRATION = 'DISMISS_REGISTRATION';

export function banishRegistration() {
  return {
    type: BANISH_REGISTRATION
  };
}

export function dismissRegistration() {
  return {
    type: DISMISS_REGISTRATION
  };
}

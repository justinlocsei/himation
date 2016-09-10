export const DISMISS_REGISTRATION = 'DISMISS_REGISTRATION';
export const VIEW_BASIC = 'VIEW_BASIC';

export function dismissRegistration() {
  return {
    type: DISMISS_REGISTRATION
  };
}

export function viewBasic(slug) {
  return {
    type: VIEW_BASIC,
    payload: {
      slug: slug
    }
  };
}


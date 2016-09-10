export const VIEW_BASIC = 'VIEW_BASIC';

export function viewBasic(slug) {
  return {
    type: VIEW_BASIC,
    payload: {
      slug: slug
    }
  };
}


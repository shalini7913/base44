export const queryClient = {
  fetchQuery: async (key, fn) => await fn(),
};

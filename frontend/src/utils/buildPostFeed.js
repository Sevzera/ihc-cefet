import { useQueryClient } from "react-query";

export const buildPostFeed = (currentPage, keys = []) => {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  const posts = [];
  for (let i = 1; i <= currentPage; i++) {
    const cachedQuery = queryCache.find(["posts", i, ...keys]);
    if (cachedQuery) {
      const {
        state: { data },
      } = cachedQuery;
      posts.push(...data);
    } else console.log(queryCache);
  }

  return posts;
};

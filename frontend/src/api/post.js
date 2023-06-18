import { useQuery, useMutation } from "react-query";
import qs from "qs";

const usePost = (id, options) => {
  return useQuery(
    ["post", id],
    async () => {
      const response = await fetch(`http://localhost:1999/api/post/${id}`);
      return response.json();
    },
    options
  );
};

const usePosts = (filters, options) => {
  const {
    userId,
    options: { page },
  } = filters;
  const stringifiedFilters = qs.stringify(filters);
  return useQuery(
    [
      "posts",
      ...(page ? [page] : []),
      ...(typeof userId === "string" ? [userId] : []),
    ],
    async () => {
      const response = await fetch(
        `http://localhost:1999/api/post?${stringifiedFilters}`
      );
      return response.json();
    },
    options
  );
};

const useCreatePost = (options) => {
  const { _id: userId } = JSON.parse(localStorage.getItem("user"));
  return useMutation(async (data) => {
    const response = await fetch("http://localhost:1999/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, userId }),
    });

    return response.json();
  }, options);
};

const useUpdatePost = (id, options) => {
  return useMutation(async (data) => {
    const response = await fetch("http://localhost:1999/api/post/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  }, options);
};

const useDeletePost = (id, options) => {
  return useMutation(async () => {
    const response = await fetch("http://localhost:1999/api/post" + id, {
      method: "DELETE",
    });

    return response.json();
  }, options);
};

export { usePost, usePosts, useCreatePost, useUpdatePost, useDeletePost };

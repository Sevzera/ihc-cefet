import { useQuery, useMutation } from "react-query";
import qs from "qs";

const useLogin = (credentials) => {
  const { email, password } = credentials;
  return useMutation(async () => {
    const response = await fetch("http://localhost:1999/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    return response.json();
  });
};

const useUser = (id, options) => {
  return useQuery(
    ["user", id],
    async () => {
      const response = await fetch(`http://localhost:1999/api/user/${id}`);
      return response.json();
    },
    options
  );
};

const useUsers = (filters, options) => {
  const stringifiedFilters = qs.stringify(filters);
  return useQuery(
    ["users", stringifiedFilters],
    async () => {
      const response = await fetch(
        `http://localhost:1999/api/user?${stringifiedFilters}`
      );
      return response.json();
    },
    options
  );
};

const useCreateUser = (options) => {
  return useMutation(async (data) => {
    const response = await fetch("http://localhost:1999/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  }, options);
};

const useUpdateUser = (id, options) => {
  return useMutation(async (data) => {
    const response = await fetch("http://localhost:1999/api/user/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  }, options);
};

const useDeleteUser = (id, options) => {
  return useMutation(async () => {
    const response = await fetch("http://localhost:1999/api/user" + id, {
      method: "DELETE",
    });

    return response.json();
  }, options);
};

export {
  useLogin,
  useUser,
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
};

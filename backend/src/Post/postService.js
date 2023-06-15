import { v4 as uuidv4 } from "uuid";
import database from "../database.js";
import userService from "../User/userService.js";
const postCollection = database.collection("post");

const postService = {};

postService.show = async (
  id,
  options = {
    user: true,
  }
) => {
  try {
    const { user } = options;
    const postData = await postCollection.findOne({ _id: id });
    if (!user) return postData;
    const userIds = [
      postData.userId,
      ...postData.comments.map((comments) => comments.userId),
    ];
    const users = await userService.index({
      _id: { $in: userIds },
    });
    postData.user = users.find((user) => user._id === postData.userId);
    postData.comments = postData.comments.map((comment) => {
      comment.user = users.find((user) => user._id === comment.userId);
      return comment;
    });
    return postData;
  } catch (error) {
    console.log("Error in postService.show: ", error);
    throw error;
  }
};

postService.index = async (
  filters,
  options = {
    page: 1,
    size: 10,
    user: true,
  }
) => {
  try {
    const { page, size, user } = options;
    const postData = await postCollection
      .aggregate([
        {
          $match: filters ? { ...filters } : {},
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $skip: (page - 1) * size,
        },
        {
          $limit: size,
        },
      ])
      .toArray();
    if (!user) return postData;
    const userIds = postData.map((post) => {
      const userId = post.userId;
      const commentUserIds = post.comments.map((comment) => comment.userId);
      return [userId, ...commentUserIds];
    });
    const flattenedUserIds = userIds.flat();
    const users = await userService.index({
      _id: { $in: flattenedUserIds.map((userId) => userId) },
    });
    const posts = postData.map((post) => {
      post.user = users.find((user) => user._id === post.userId);
      post.comments = post.comments.map((comment) => {
        comment.user = users.find((user) => user._id === comment.userId);
        return comment;
      });
      return post;
    });
    return posts;
  } catch (error) {
    console.log("Error in postService.index: ", error);
    throw error;
  }
};

postService.create = async (data) => {
  try {
    const { userId, text = "", imageSrc = "" } = data;
    if (!userId) throw new Error("Missing _id or userId");

    const user = await userService.show(userId);
    if (!user) throw new Error("User not found");

    const post = {
      _id: uuidv4(),
      userId,
      text,
      imageSrc,
      likes: [],
      comments: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return await postCollection.insertOne(post);
  } catch (error) {
    console.log("Error in postService.create: ", error);
    throw error;
  }
};

postService.update = async (id, data) => {
  try {
    if (!id) throw new Error("Missing id");
    const { text, imageSrc, likes, comments } = data;

    const post = {
      ...(text && { text }),
      ...(imageSrc && { imageSrc }),
      ...(likes && { likes }),
      ...(comments && { comments }),
      updatedAt: Date.now(),
    };

    return await postCollection.updateOne({ _id: id }, { $set: post });
  } catch (error) {
    console.log("Error in postService.update: ", error);
    throw error;
  }
};

postService.delete = async (id) => {
  try {
    if (!id) throw new Error("Missing id");
    return await postCollection.deleteOne({ _id: id });
  } catch (error) {
    console.log("Error in postService.delete: ", error);
    throw error;
  }
};

export default postService;

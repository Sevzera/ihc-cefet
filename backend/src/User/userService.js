import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import database from "../database.js";
import imgbbUploader from "imgbb-uploader";
const userCollection = database.collection("user");

const userService = {};
const imgBB_key = "d800fef0297081cd154ac0a53179efe1";

userService.login = async (credentials) => {
  try {
    const { email, password } = credentials;
    if (!email || !password) throw new Error("Missing credentials");

    const user = await userCollection.findOne({ email });
    if (!user) throw new Error("Email não cadastrado");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) throw new Error("Senha incorreta");

    return user;
  } catch (error) {
    console.log("Error in userService.login: ", error);
    throw error;
  }
};

userService.show = async (id) => {
  try {
    return await userCollection.findOne({ _id: id });
  } catch (error) {
    console.log("Error in userService.show: ", error);
    throw error;
  }
};

userService.index = async (filters) => {
  try {
    return await userCollection.find(filters ? { ...filters } : {}).toArray();
  } catch (error) {
    console.log("Error in userService.index: ", error);
    throw error;
  }
};

userService.create = async (data) => {
  try {
    const { email, password, name, profilePictureSrc } = data;
    if (!email || !password || !name)
      throw new Error("Missing required fields");

    const newData = {
      _id: uuidv4(),
      email,
      password: await bcrypt.hash(password, 10),
      name,
      profilePictureSrc:
        "https://i.ibb.co/nwfMnMC/my-Manga-List-default-user-profile-pic.png",
      bannerImageSrc:
        "https://www.bio.org/act-root/bio/assets/images/banner-default.png",
      friends: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (profilePictureSrc) {
      const imgbbOptions = {
        apiKey: imgBB_key,
        base64string: newData.profilePictureSrc,
        name: Date.now() + newData._id,
      };
      const response = await imgbbUploader(imgbbOptions);
      const { url } = response;
      newData.profilePictureSrc = url;
    }

    return userCollection.insertOne(newData);
  } catch (error) {
    console.log("Error in userService.create: ", error);
    throw error;
  }
};

userService.update = async (id, data) => {
  try {
    if (!id) throw new Error("Missing id");

    const {
      name,
      email,
      password,
      friends,
      profilePictureSrc,
      bannerImageSrc,
    } = data;

    let updatedData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(password && { password: await bcrypt.hash(password, 10) }),
      ...(friends && { friends }),
      updatedAt: Date.now(),
    };

    if (profilePictureSrc) {
      const imgbbOptions = {
        apiKey: imgBB_key,
        base64string: profilePictureSrc,
        name: id + Date.now(),
      };
      const response = await imgbbUploader(imgbbOptions);
      const { url } = response;
      updatedData.profilePictureSrc = url;
    }

    if (bannerImageSrc) {
      const imgbbOptions = {
        apiKey: imgBB_key,
        base64string: bannerImageSrc,
        name: "banner_" + id + Date.now(),
      };
      const response = await imgbbUploader(imgbbOptions);
      const { url } = response;
      updatedData.bannerImageSrc = url;
    }

    return userCollection.findOneAndUpdate({ _id: id }, { $set: updatedData });
  } catch (error) {
    console.log("Error in userService.update: ", error);
    throw error;
  }
};

userService.delete = async (id) => {
  try {
    if (!id) throw new Error("Missing id");
    return await userCollection.deleteOne({ _id: id });
  } catch (error) {
    console.log("Error in userService.delete: ", error);
    throw error;
  }
};

export default userService;

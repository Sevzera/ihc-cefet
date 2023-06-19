import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import database from "../database.js";
import imgbbUploader from "imgbb-uploader";
const userCollection = database.collection("user");

const userService = {};
const imgBB_url = 'https://api.imgbb.com/1/upload'

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
    const { email, password, name } = data;
    if (!email || !password || !name)
      throw new Error("Missing required fields");

    const encryptedPassword = await bcrypt.hash(password, 10);
    const defaultProfilePicture =
      "https://i.ibb.co/nwfMnMC/my-Manga-List-default-user-profile-pic.png";
    const defaultBanner =
      "https://www.bio.org/act-root/bio/assets/images/banner-default.png";
    const user = {
      _id: uuidv4(),
      email,
      password: encryptedPassword,
      name,
      profilePictureSrc: defaultProfilePicture,
      bannerImageSrc: defaultBanner,
      friends: [],
      friendRequests: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (data.profilePictureSrc == undefined) {
      return userCollection.insertOne(user);
    } else {
      const imgbbOptions = {
        apiKey: "d800fef0297081cd154ac0a53179efe1",
        base64string: data.profilePictureSrc,
        name: Date.now() + data._id,
      }

      return imgbbUploader(imgbbOptions).then(async (response) => {
        user.profilePictureSrc = response.url;
        return userCollection.insertOne(user)
      }).catch((error) => console.error(error))
    }
  } catch (error) {
    console.log("Error in userService.create: ", error);
    throw error;
  }
};

userService.update = async (id, data) => {
  try {
    if (!id) throw new Error("Missing id");

    const currentUserData = await userCollection.findOne({ _id: id });
    let newProfilePicture = currentUserData.profilePictureSrc;
    let newBanner = currentUserData.bannerImageSrc;

    if (
      data.profilePictureSrc != currentUserData.profilePictureSrc &&
      data.profilePictureSrc != undefined
    ) {
      const imgbbOptions = {
        apiKey: "d800fef0297081cd154ac0a53179efe1",
        base64string: data.profilePictureSrc,
        name: currentUserData._id + Date.now(),
      };
      newProfilePicture = await imgbbUploader(imgbbOptions)
        .then(async (response) => {
          return response.url;
        })
        .catch((error) => console.error(error));
    }

    if (
      data.bannerImageSrc != currentUserData.bannerImageSrc &&
      data.bannerImageSrc != undefined
    ) {
      const imgbbOptions = {
        apiKey: "d800fef0297081cd154ac0a53179efe1",
        base64string: data.bannerImageSrc,
        name: "banner_" + currentUserData._id + Date.now(),
      };
      newBanner = await imgbbUploader(imgbbOptions)
        .then(async (response) => {
          return response.url;
        })
        .catch((error) => console.error(error));
    }

    data.profilePictureSrc = newProfilePicture;
    data.bannerImageSrc = newBanner;

    return userCollection.findOneAndUpdate({ _id: id }, { $set: data });
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

import database from "../database.js";
import imgbbUploader from 'imgbb-uploader';
import axios from "axios";
const userCollection = database.collection("user");

const userService = {};
const imgBB_url = 'https://api.imgbb.com/1/upload'

userService.show = async (id) => {
  try {
    return await userCollection.findOne({ _id: id });
  } catch (error) {
    console.log("Error in userService.show: ", error);
  }
};

userService.index = async (filters) => {
  try {
    return await userCollection.find(filters ? { ...filters } : {}).toArray();
  } catch (error) {
    console.log("Error in userService.index: ", error);
  }
};

userService.create = async (data) => {
  try {
    const { _id, email, password, name } = data;
    if (!_id || !email || !password || !name)
      throw new Error("Missing required fields");

    const defaultProfilePicture = 'https://i.ibb.co/nwfMnMC/my-Manga-List-default-user-profile-pic.png';
    const defaultBanner = 'https://www.bio.org/act-root/bio/assets/images/banner-default.png'
    const user = {
      _id,
      email,
      password,
      name,
      profilePictureSrc: defaultProfilePicture,
      bannerImageSrc: defaultBanner,
      friends: [],
      friendRequests: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (data.profilePictureSrc == undefined) {
      return userCollection.insertOne(user)
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
  }
};

userService.update = async (id, data) => {
  try {
    if (!id) throw new Error("Missing id");

    const currentUserData = await userCollection.findOne({ "_id": id })
    let newProfilePicture = currentUserData.profilePictureSrc
    let newBanner = currentUserData.bannerImageSrc

    if (data.profilePictureSrc != currentUserData.profilePictureSrc && data.profilePictureSrc != undefined) {
      const imgbbOptions = {
        apiKey: "d800fef0297081cd154ac0a53179efe1",
        imagePath: data.profilePictureSrc,
        name: currentUserData._id + Date.now(),
      }
      newProfilePicture = await imgbbUploader(imgbbOptions).then(async (response) => {
        return response.url
      }).catch((error) => console.error(error))
    }

    if (data.bannerImageSrc != currentUserData.bannerImageSrc && data.bannerImageSrc != undefined) {
      const imgbbOptions = {
        apiKey: "d800fef0297081cd154ac0a53179efe1",
        imagePath: data.bannerImageSrc,
        name: "banner_" + currentUserData._id + Date.now(),
      }
      newBanner = await imgbbUploader(imgbbOptions).then(async (response) => {
        return response.url
      }).catch((error) => console.error(error))
    }

    data.profilePictureSrc = newProfilePicture
    data.bannerImageSrc = newBanner

    return userCollection.findOneAndUpdate({ "_id": id }, { $set: data })

  } catch (error) {
    console.log("Error in userService.update: ", error);
  }
};

userService.delete = async (id) => {
  try {
    if (!id) throw new Error("Missing id");
    return await userCollection.deleteOne({ _id: id });
  } catch (error) {
    console.log("Error in userService.delete: ", error);
  }
};

export default userService;

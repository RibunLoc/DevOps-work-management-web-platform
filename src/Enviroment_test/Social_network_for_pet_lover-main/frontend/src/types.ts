// types.ts
export interface User {
  _id: string; // or other relevant properties
  firstname: string;
  lastname: string;
  avatar: string;
  location: string;
  email: string;
  description: string;
  // Add any other user-related properties
  petCount: number;
  isFollowed: boolean;
  followerCount: number;
}
export interface Position {
  x: number;
  y: number;
}
// export interface MessageComponentType {
//   content: string;
//   timeStamp: string;
//   isSender: boolean | undefined;
// }

export interface RecentChat {
  _id: string;
  latestMessage: string;
  timeStamp: string;
}
export interface RecentChatInSideBar {
  _id: string;
  latestMessage: string;
  timeStamp: string;
  userInfo: User;
}

export interface Recipent {
  recipentEmail: string | undefined;
  senderEmail: string | undefined;
  content: string | null;
  image?: string
}

export interface MessageComponentType {

    content: string,
    timeStamp: string,
    isSender: boolean|undefined
    isChatbot: boolean|undefined
    image?: string
  }

export interface RecentChat {
  _id: string;
  latestMessage: string;
  timeStamp: string;
  image?: string,
  userInfo: {
    email: string | undefined;

    phone: string | undefined;
    firstname: string | undefined;
    lastname: string | undefined;

    avatar: string | undefined;
  } | null;
}

export interface  EventSocket {
  eventType: string,
  postId: string | null | undefined,
  createdAt: Date,
  userName: string,
  userAvatar: string,
  postOwnerEmail?: string
}


export interface AuthState {
  isAuthenticated: boolean;
  payload: {
    user: User | null;
    jwt: string | null;
  };
}

export interface LogInAction {
  type: "LOG_IN";
  payload: {
    user: User;
    jwt: string;
  };
}

export interface LogOutAction {
  type: "LOG_OUT";
}

export interface Event {
  eventName: string;
  description: string;
  dateTime: Date;
  imageUrl: string;
  location: string;
  createdBy: string;
  createdAt: string;
  isDelete: boolean;
  link: string
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  userId: string;

  likeCount: number;
  userInfo: UserInfo;
  likedUserInfo: User[];
  isLiked: boolean;
  isSaved: boolean;
}

export interface Like {
  _id: string;
  userId: string;
  targetId: string;
  targetType: string;
  timeStamp: Date;
  isDeleted: boolean;
}

export interface UserInfo {
  firstname: string;
  lastname: string;
  avatar: string;
  _id: string;
}

export interface PostResponse {
  recommentPost: Post[];
}

export interface FormPost {
  title: string|undefined;
  content: string|undefined;
  images: string[]|undefined;
}

export interface FormUser {
  firstname: string|undefined;
  lastname: string|undefined;
  avatar: string|undefined;
  location: string|undefined;
  description: string|undefined;
}

export interface FormPet {
  name: string;
  bio: string;
  profilePicture: string;
  sex: string;
  height: number;
  weight: number;
  type: string;
  breed: string;
  birthday: string;
}

export interface Pet {
  _id: string;
  name: string;
  bio: string;
  profilePicture: string;
  userId: string;
  sex: string;
  height: number;
  weight: number;
  type: string;
  breed: string;
  birthday: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: string;
  followerCount: number;
}

export interface PetFavourite {
  _id: String;
  petInfo: Pet;
  ownerInfo: User;
}

export interface PostFavourite {
  _id: String;
  postInfo: Post;
  ownerInfo: User;
}

export interface IComment {
  _id: string;
  content: string;
  postId: string;
  userId: string;
  parentId: string | null;
  createdAt: Date;
  isDeleted: boolean;

  replies: IComment[];
  userInfo: UserInfo;
  likedUserInfo: User[];
  isLiked: Like;
}
export interface PostComment {
  content: string;
  postId: string;
  userId: string;
  parentId: string;
}
export type AuthAction = LogInAction | LogOutAction;

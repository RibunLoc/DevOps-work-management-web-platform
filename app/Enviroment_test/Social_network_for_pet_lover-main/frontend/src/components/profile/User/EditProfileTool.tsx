import { EmojiEmotions } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  InputBase,
  Modal,
  Stack,
  TextField,
  Typography,
  Link
} from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import React, { useEffect, useRef, useState } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import uploadToCloudinary from "../UploadImage";
import { Post, FormPost, User, FormUser } from "../../../types";
import style from "./css/EditProfileTool.module.css";
import {
  handleUpdateDescriptionAPI,
  handleUpdateNameAPI,
} from "../../../sercives/api";
import UploadAvatarTool from "./UploadAvatarTool";

interface PostToolDisplayProps {
  oldUserInformation: User | undefined;
  isOpen: boolean; // Điều khiển hiển thị
  onClose: () => void;
  onUpdate: (newUser: User | undefined) => void; // Hàm đóng modal
}

const EditProfileTool: React.FC<PostToolDisplayProps> = ({
  isOpen,
  onClose,
  onUpdate,
  oldUserInformation,
}) => {
  const [isOpenUploadAvatarModal, setIsOpenUploadAvatarModal] =
    useState(false);
  const [fields, setFields] = useState<FormUser>({
    firstname: "",
    lastname: "",
    avatar: "",
    location: "",
    description: "",
  });
  const [isDisabledEditName, setIsDisabledEditName] = useState(true);
  const handleUnDisabledNameFields = () => {
    setIsDisabledEditName(false);
  };
  const [isDisabledEditDescription, setIsDisabledEditDescription] =
    useState(true);

    const [isDisabledChangePasswordDescription, setIsDisabledChangePasswordDescription] =
    useState(true);

  const handleUnDisableDescription = () => {
    setIsDisabledEditDescription(false);
  };

  const handleUnDisableChangePassword = () => {
    setIsDisabledChangePasswordDescription(false);
  };
  const handleCancelUpdateName = () => {
    setFields({
      lastname: userData?.lastname,
      firstname: userData?.firstname,
      location: userData?.location,
      avatar: userData?.avatar,
      description: userData?.description,
    });
    setIsDisabledEditName(true);
  };

  const handleCancelUpdateDescription = () => {
    setFields({
      lastname: userData?.lastname,
      firstname: userData?.firstname,
      location: userData?.location,
      avatar: userData?.avatar,
      description: userData?.description,
    });
    setIsDisabledEditDescription(true);
  };

  const handleSaveName = async () => {
    const result = await handleUpdateNameAPI(
      fields.lastname,
      fields.firstname,
      userData?._id
    );
    if (result) setIsDisabledEditName(true);
  };

  const handleSaveDescription = async () => {
    const result = await handleUpdateDescriptionAPI(
      fields.description,
      userData?._id
    );
    if (result) setIsDisabledEditDescription(true);
  };
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isChanged, setIsChanged] = useState(false);
  const [_message, setMessage] = useState("");
  const [userData, setUserData] = useState<User>();

  const [isDisableSaveEditNameButton, setIsDisableSaveEditNameButton] =
    useState(true);
  const [isDisableSaveDescriptonButton, setIsDisableSaveDescriptionButton] =
    useState(true);
    
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const id = target.id;
    const value = target.value;
    if (id.includes("lastname") && value.length > 150) {
      return;
    }
    if (id === "firstname") {
      setIsDisableSaveEditNameButton(value === userData?.firstname);
    }
    if (id === "lastname") {
      setIsDisableSaveEditNameButton(value === userData?.lastname);
    }
    if (id === "description") {
      setIsDisableSaveDescriptionButton(value === userData?.description);
    }
    setFields((fields) => ({
      ...fields,
      ...{
        [id]: value,
      },
    }));
    setIsChanged(true);
  };
  useEffect(() => {
    fetchData(); // Call fetchData inside useEffect
  }, []);
  const fetchData = async () => {
    const userId = localStorage.getItem("userId");
    const url = `${process.env.REACT_APP_API_URL}/api/v1/user/getbyid/${userId}`;
    try {
      const response = await fetch(url, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Error in getting user");
      }
      const data = await response.json();
      if (data.user) {
        setUserData(data.user);
        setFields({
          lastname: data.user.lastname,
          firstname: data.user.firstname,
          location: data.user.location,
          avatar: data.user.avatar,
          description: data.user.description,
        });
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };
  const handleClose = () => {
    if (isChanged) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to close?"
      );
      if (!confirmClose) return; // Hủy đóng nếu người dùng chọn "Cancel"
    }
    onClose();
  };

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  const CheckValidField = () => {
    if (fields.lastname === "" || !selectedImage || fields.firstname === "") {
      setMessage("Incomplete information");
      return false;
    }
    return true;
  };
  const handleUpdate = () =>{
    fetchData()
  }
  return (
    <>
      <Modal
        open={isOpen}
        onClose={handleClose}
        sx={{ backdropFilter: "blur(2px)" }}
      >
        <Card
          sx={{
            display: "flex",
            position: "relative",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            height: "540px",
            width: "540px", // Adjust height based on content
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "9px",
            outline: "none",
          }}
        >
          <Button
            onClick={handleClose} // Đặt lại ảnh về null khi nhấn
            sx={{
              position: "absolute",
              top: "8px",
              right: "8px",
              opacity: "0.4",
              backgroundColor: "#8E8E8D", // Màu nền trắng mờ
              color: "#F4F4F5", // Màu chữ
              borderRadius: "50%", // Hình dạng tròn
              minWidth: "32px", // Kích thước nhỏ nhất
              height: "32px", // Chiều cao cố định
              "&:hover": {
                backgroundColor: "#C8C8C9",
                color: "#000",
              },
            }}
          >
            <a>X</a>
          </Button>
          <Stack
            direction="column"
            spacing={2}
            sx={{ width: "100%", textAlign: "center" }}
          >
            <CardHeader
              title="Edit profile"
              subheader="Some options for you"
              sx={{ bgcolor: "#f4f4f4", flexDirection: "col" }} // Bạn có thể tùy chỉnh thêm
            />
            {/* Nội dung chính của modal */}
            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                margin: "0px !important",
                overflowY: "scroll",
              }}
            >
              <Stack direction="row">
                <Avatar src={userData?.avatar}></Avatar>
                <Typography
                  variant="h5"
                  sx={{ alignSelf: "center", marginLeft: "10px" }}
                >
                  {userData && userData.firstname + " " + userData.lastname}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p className={style.section}>Avatar</p>
                <Button onClick={()=>{setIsOpenUploadAvatarModal(true)}}>Chỉnh sửa</Button>
              </Stack>
              <UploadAvatarTool userData={userData} isOpen={isOpenUploadAvatarModal} onClose={()=>{setIsOpenUploadAvatarModal(false)}} onUpdate={handleUpdate}/>
              <Stack direction="row" style={{ justifyContent: "center" }}>
                <div className={style.avatar}>
                  <img src={userData?.avatar} />
                </div>
              </Stack>
              {
                
              }
              {/* Name */}
              <Stack
                direction="row"
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p className={style.section}>Name</p>
                <Button onClick={handleUnDisabledNameFields}>Chỉnh sửa</Button>
              </Stack>
              <Stack direction="column">
                <TextField
                  id="firstname"
                  label={<span style={{ fontSize: "18px" }}>First Name</span>}
                  value={fields.firstname}
                  onChange={onChange}
                  placeholder="First Name"
                  sx={{
                    marginTop: "10px",
                    "& .MuiOutlinedInput-root": {
                      "&:focus-within fieldset": {
                        border: "1px solid #000", // Hiển thị viền khi focus
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "2px", // Tùy chỉnh padding nội dung
                    },
                  }}
                  multiline
                  maxRows={3}
                  fullWidth
                  disabled={isDisabledEditName}
                />
                <TextField
                  id="lastname"
                  label={<span style={{ fontSize: "18px" }}>Last Name</span>}
                  value={fields.lastname}
                  onChange={onChange}
                  placeholder="Last Name"
                  sx={{
                    marginTop: "10px",
                    "& .MuiOutlinedInput-root": {
                      "&:focus-within fieldset": {
                        border: "1px solid #000", // Hiển thị viền khi focus
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "2px", // Tùy chỉnh padding nội dung
                    },
                  }}
                  multiline
                  maxRows={3}
                  fullWidth
                  disabled={isDisabledEditName}
                />
                {!isDisabledEditName ? (
                  <Stack
                    direction="row"
                    style={{
                      justifyContent: "center",
                      gap: "10px",
                      padding: "5px",
                    }}
                  >
                    <Button
                      onClick={handleSaveName}
                      disabled={isDisableSaveEditNameButton}
                    >
                      {" "}
                      Save
                    </Button>
                    <Button onClick={handleCancelUpdateName}> Cancel</Button>
                  </Stack>
                ) : (
                  ""
                )}
              </Stack>
              {/* Description */}
              <Stack
                direction="row"
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p className={style.section}>Description</p>
                <Button onClick={handleUnDisableDescription}>Chỉnh sửa</Button>
              </Stack>
              <Stack direction="column">
                <TextField
                  id="description"
                  label={<span style={{ fontSize: "18px" }}>Description</span>}
                  value={fields.description}
                  onChange={onChange}
                  placeholder="Description"
                  sx={{
                    marginTop: "10px",
                    "& .MuiOutlinedInput-root": {
                      "&:focus-within fieldset": {
                        border: "1px solid #000", // Hiển thị viền khi focus
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "2px", // Tùy chỉnh padding nội dung
                    },
                  }}
                  multiline
                  maxRows={3}
                  fullWidth
                  disabled={isDisabledEditDescription}
                />
                {!isDisabledEditDescription ? (
                  <Stack
                    direction="row"
                    style={{
                      justifyContent: "center",
                      gap: "10px",
                      padding: "5px",
                    }}
                  >
                    <Button
                      onClick={handleSaveDescription}
                      disabled={isDisableSaveDescriptonButton}
                    >
                      {" "}
                      Save
                    </Button>
                    <Button onClick={handleCancelUpdateDescription}>
                      {" "}
                      Cancel
                    </Button>
                  </Stack>
                ) : (
                  ""
                )}
                
              </Stack>

              <Link href="/change_password">
                <Button>
                  Change password
                </Button>
              </Link>
            </CardContent>
          </Stack>
        </Card>
      </Modal>
    </>
  );
};

export default EditProfileTool;

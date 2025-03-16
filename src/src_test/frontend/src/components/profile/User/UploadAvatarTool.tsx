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
} from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import uploadToCloudinary from "../UploadImage";
import { Post, FormPost, User, FormUser } from "../../../types";
import style from "./css/UploadAvatarTool.module.css";
import { handleUpdateAvatarAPI } from "../../../sercives/api";

interface AvatarToolDisplayProps {
  userData: User | null | undefined;
  isOpen: boolean; // Điều khiển hiển thị
  onClose: () => void;
  onUpdate: () => void; // Hàm đóng modal
}

const EditProfileTool: React.FC<AvatarToolDisplayProps> = ({
  userData,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isChanged, setIsChanged] = useState(false);
  const [_message, setMessage] = useState("");
  //const [userData, setUserData] = useState<User>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    const validExtensions = [".png", ".jpg", ".jpeg"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (!fileExtension || !validExtensions.includes(`.${fileExtension}`)) {
      console.log(
        "Vui lòng chọn tệp có định dạng .png, .jpg, .jpeg hoặc .gif."
      );
      return;
    }
    setSelectedImage(file);
  };
  const handleUploadImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
  const handleUpdateData = async () => {
    if (selectedImage) {
      let uploadedImageUrl = await uploadToCloudinary(selectedImage);
      console.log("imagsadkasja",uploadedImageUrl)
      const response = await handleUpdateAvatarAPI(
        uploadedImageUrl,
        userData?._id
      );
      if (response) onClose();
    }
  };

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
            height: "450px",
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
            <Typography
              variant="h5"
              sx={{ alignSelf: "center", marginLeft: "10px" }}
            >
              {userData && userData.firstname + " " + userData.lastname}
            </Typography>
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
              <Stack
                direction="column"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Box
                  sx={{
                    position: "relative",
                    border: "1px solid #ddd",
                    borderRadius: "̀50%",
                    marginBottom: "16px",
                    padding: "10px",
                  }}
                >
                  <div className={clsx(style.avatar)}>
                    <img
                      src={
                        selectedImage
                          ? URL.createObjectURL(selectedImage)
                          : userData?.avatar
                      }
                      alt="Uploaded"
                      style={{
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  {selectedImage ? (
                    <Button
                      onClick={() => setSelectedImage(null)} // Đặt lại ảnh về null khi nhấn
                      sx={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        opacity: "0.4",
                        backgroundColor: "#99A67A", // Màu nền trắng mờ
                        border: "2px solid #CCDCBA",
                        color: "#E6F5DE", // Màu chữ
                        borderRadius: "50%", // Hình dạng tròn
                        minWidth: "32px", // Kích thước nhỏ nhất
                        height: "32px", // Chiều cao cố định
                        "&:hover": {
                          backgroundColor: "#B6C79B",
                          color: "#708258", // Màu chữ
                          border: "1px solid #99A67A", // Hiệu ứng hover
                        },
                      }}
                    >
                      <a>X</a>
                    </Button>
                  ) : (
                    ""
                  )}
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUploadImage}
                  startIcon={<AddPhotoAlternateOutlinedIcon />}
                >
                  Upload Image
                </Button>
                <input
                  ref={fileInputRef} // Gắn ref vào input
                  type="file"
                  accept="image/png, image/jpeg, image/gif" // Cho phép chỉ chọn ảnh
                  onChange={handleImageChange} // Xử lý sự kiện thay đổi tệp
                  style={{ display: "none" }} // Ẩn input đi
                />
              </Stack>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateData}
                startIcon={<AddPhotoAlternateOutlinedIcon />}
                disabled={!selectedImage}
              >
                Confirm
              </Button>
            </CardContent>
          </Stack>
        </Card>
      </Modal>
    </>
  );
};

export default EditProfileTool;

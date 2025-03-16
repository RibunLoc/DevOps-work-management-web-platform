import { EmojiEmotions } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  ImageList,
  InputBase,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import React, { useContext, useEffect, useRef, useState } from "react";
import uploadToCloudinary from "../UploadImage";
import { Post, FormPost, User } from "../../../types";
import { PostContext } from "./PostContext";
import { title } from "process";
import { handleUpdatePostAPI } from "../../../sercives/api";

interface PostToolDisplayProps {
  isOpen: boolean; // Điều khiển hiển thị
  onClose: () => void;
  onUpdated?: () => void; // Hàm đóng modal
}

const PostToolDisplay: React.FC<PostToolDisplayProps> = ({
  isOpen,
  onClose,
  onUpdated,
}) => {
  const { post } = useContext(PostContext)!;
  const [fields, setFields] = useState<FormPost>({
    title: post?.title,
    content: post?.content,
    images: post?.images,
  });
  const [selectedImages, setSelectedImages] = useState<File[] | null>(null);
  const [isChanged, setIsChanged] = useState(false);
  const [_message, setMessage] = useState(false);
  const [isDisableConfirmButton, setIsDisableConfirmButton] = useState(true);
  const [userData, setUserData] = useState<User>();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const id = target.id;
    const value = target.value;
    if (id.includes("title") && value.length > 150) {
      return;
    }
    if (id === "title") setIsDisableConfirmButton(post?.title === value);
    if (id === "content") setIsDisableConfirmButton(post?.content === value);

    setFields((fields) => ({
      ...fields,
      ...{
        [id]: value,
      },
    }));
    setIsChanged(true);
  };
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const fetchData = async () => {
      const url = `${process.env.REACT_APP_API_URL}/api/v1/user/getbyid/${userId}`;
      try {
        const response = await fetch(url, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Error in getting user");
        }
        const data = await response.json();
        setUserData(data.user);
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };

    fetchData(); // Call fetchData inside useEffect
  }, []);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];

    // Kiểm tra phần mở rộng của tệp (chỉ cho phép .png, .jpg, .jpeg, .gif)
    const validExtensions = [".png", ".jpg", ".jpeg", ".gif"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (!fileExtension || !validExtensions.includes(`.${fileExtension}`)) {
      console.log(
        "Vui lòng chọn tệp có định dạng .png, .jpg, .jpeg hoặc .gif."
      );
      return;
    }
    setIsDisableConfirmButton(false);
    setSelectedImages((prev) => (prev ? [...prev, file] : [file]));
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
    setFields({
      title: post?.title,
      content: post?.content,
      images: post?.images,
    });
    setSelectedImages([]);
    setIsDisableConfirmButton(true);
    onClose();
  };

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleUpdateData = async () => {
    if (selectedImages) {
      for (let selectedImage of selectedImages) {
        let uploadedImageUrl = await uploadToCloudinary(selectedImage);
        fields.images?.push(uploadedImageUrl);
        console.log("fields.images", fields.images);
      }
    }
    if (!CheckValidField()) {
      window.alert(_message);
      return;
    }
    const response = await handleUpdatePostAPI(
      fields.title,
      fields.content,
      fields.images ? fields.images : [],
      post?._id
    );

    if (response) {
      if(onUpdated) onUpdated();
      onClose();
    } else {
      window.alert("Have a trouble");
    }
  };
  const CheckValidField = () => {
    if (
      fields.title === "" &&
      fields.images?.length === 0 &&
      fields.content === ""
    ) {
      return false;
    }
    return true;
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
              title="Edit Post"
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
              <TextField
                id="title"
                label={<span style={{ fontSize: "18px" }}>Title</span>}
                value={fields.title}
                onChange={onChange}
                placeholder="Write title post..."
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
              />
              <TextField
                id="content"
                value={fields.content}
                onChange={onChange}
                placeholder="Write content post..."
                sx={{
                  padding: 0,
                  "& .MuiOutlinedInput-root": {
                    padding: 0,
                    "&:hover fieldset": {
                      border: "none", // Xóa viền khi hover
                    },
                    "&.Mui-focused fieldset": {
                      border: "none", // Xóa viền khi focus
                    },
                    "& fieldset": {
                      border: "none", // Xóa viền mặc định
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "5px", // Điều chỉnh padding nội dung
                  },
                }}
                multiline
                fullWidth
                required
              />
              {fields.images
                ? fields.images.map((imgUrl) => (
                    <Box
                      sx={{
                        position: "relative",
                        width: "auto",
                        paddingTop: "75%", // 4:3 Aspect Ratio
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        overflow: "hidden",
                        marginBottom: "16px",
                      }}
                    >
                      <img
                        src={imgUrl}
                        alt="Uploaded"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <Button
                        onClick={() => {
                          setFields((prev) => {
                            const postImagesLength = post?.images?.length || 0;
                            const fieldsImagesLength =
                              fields?.images?.length || 0;
                            setIsDisableConfirmButton(
                              postImagesLength - fieldsImagesLength === 1
                            );
                            return {
                              ...prev,
                              images: prev.images?.filter(
                                (img) => imgUrl !== img
                              ),
                            };
                          });
                        }}
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
                    </Box>
                  ))
                : "No image selected"}
              {selectedImages
                ? selectedImages.map((selectedImage) => (
                    <Box
                      sx={{
                        position: "relative",
                        width: "auto",
                        paddingTop: "75%", // 4:3 Aspect Ratio
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        overflow: "hidden",
                        marginBottom: "16px",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Uploaded"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <Button
                        onClick={() => {
                          setSelectedImages((prev) => {
                            setIsDisableConfirmButton(
                              selectedImages.length === 1
                            );
                            return prev
                              ? prev.filter(
                                  (img) =>
                                    img?.lastModified !==
                                    selectedImage?.lastModified
                                )
                              : [];
                          });
                        }}
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
                    </Box>
                  ))
                : ""}
            </CardContent>
            {/* Các button hoặc các công cụ khác */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "auto",
                gap: 2,
                justifyContent: "center",
                backgroundColor: "#E6F5DE",
                padding: "10px",
              }}
            >
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
              <Button
                variant="contained"
                color="secondary"
                onClick={handleUpdateData}
                startIcon={<SendOutlinedIcon />}
                disabled={isDisableConfirmButton}
              >
                Confirm
              </Button>
            </Box>
          </Stack>
        </Card>
      </Modal>
    </>
  );
};

export default PostToolDisplay;

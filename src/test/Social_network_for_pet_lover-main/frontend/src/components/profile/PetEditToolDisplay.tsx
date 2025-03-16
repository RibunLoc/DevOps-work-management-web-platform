import { EmojiEmotions } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputBase,
  Modal,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React, { useRef, useState } from "react";
import uploadToCloudinary from "../profile/UploadImage";
import { FormPet, Pet } from "../../types";
import DatePicker from "./DatePicker";
import { format, parseISO } from "date-fns";

interface PetEditToolDisplayProps {
  isOpen: boolean; // Điều khiển hiển thị
  editPet: Pet;
  onClose: () => void;
  onUpdatedPet: (newPet: Pet | undefined) => void;
}
const PetEditToolDisplay: React.FC<PetEditToolDisplayProps> = ({
  isOpen,
  editPet,
  onClose,
  onUpdatedPet,
}) => {
  const [fields, setFields] = useState<FormPet>({
    name: editPet.name,
    bio: editPet.bio,
    profilePicture: editPet.profilePicture,
    sex: editPet.sex,
    height: editPet.height,
    weight: editPet.weight,
    type: editPet.type,
    breed: editPet.breed,
    birthday: editPet.birthday,
  });
  let _message = "";
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isChanged, setIsChanged] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const id = target.id;
    let value = target.value;
    if (id.includes("title") && value.length > 150) {
      return;
    }
    if (id.includes("height") || id.includes("weight")) {
      value = value.replace(/[^0-9]/g, "").replace(/^0+/, "");
    }
    setFields((fields) => ({
      ...fields,
      ...{
        [id]: value,
      },
    }));
  };

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
      if (!confirmClose) return;
    }
    onClose();
  };
  const CheckValidInput = (fields: FormPet) => {
    if (fields.bio == "") {
      _message = "Ban chua nhap bio";
      return null;
    }
    if (fields.name == "") {
      _message = "Ban chua nhap bio";
      return null;
    }
    if (fields.sex == "") {
      _message = "Ban chua nhap sex";
      return null;
    }
    if (fields.weight == 0) {
      _message = "Ban chua nhap can nang";
      return null;
    }
    if (fields.height == 0) {
      _message = "Ban chua nhap chieu cao";
      return null;
    }
    if (fields.type == "") {
      _message = "Ban chua nhap loai thu cung";
      return null;
    }
    if (
        fields.bio !== editPet.bio ||
        fields.birthday !== editPet.birthday ||
        fields.breed !== editPet.breed ||
        fields.height !== editPet.height ||
        fields.name !== editPet.name ||
        fields.sex !== editPet.sex ||
        fields.type !== editPet.type ||
        fields.weight !== editPet.weight
        ||  selectedImage
      )
      {
          setIsChanged(true);
      }
      else {
        setIsChanged(false);
        _message="Thoat ko thay doi "
        return null
      }
    return true;
  };
  const handleUpdateData = async () => {
    if (!CheckValidInput(fields)) {
      window.alert(_message);
      return;
    }
    let response;
    let uploadedImageUrl = editPet.profilePicture;
    if (selectedImage) {
      uploadedImageUrl = await uploadToCloudinary(selectedImage);
    }
    setFields((fields) => ({
      ...fields,
      profilePicture: uploadedImageUrl,
    }));
    response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/pet/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        petId:editPet._id,
        name: fields.name,
        bio: fields.bio,
        profilePicture: uploadedImageUrl,
        sex: fields.sex,
        height: fields.height,
        weight: fields.weight,
        type: fields.type,
        breed: fields.breed,
        birthday: fields.birthday,
      }),
    });

    if (response.ok) {
      const dataResponse = await response.json();
      onUpdatedPet(dataResponse.updatedPet);
      onClose();
    } else {
      window.alert("Have a trouble");
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
              title="Edit information pet"
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
                <Avatar src="https://via.placeholder.com/40"></Avatar>
                <Typography
                  variant="h5"
                  sx={{ alignSelf: "center", marginLeft: "10px" }}
                >
                  FhuAnn
                </Typography>
                {/* <Typography variant="body1" sx={{ alignSelf: "center" }}>
                  đang cảm thấy
                </Typography> */}
                <EmojiEmotions sx={{ alignSelf: "center" }} />
              </Stack>
              <TextField
                id="name"
                label={<span style={{ fontSize: "18px" }}>Name</span>}
                value={fields.name}
                onChange={onChange}
                placeholder="Write your pet's name..."
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
                id="birthday"
                type="date"
                value={
                  fields.birthday
                    ? format(parseISO(fields.birthday), "yyyy-MM-dd")
                    : ""
                }
                onChange={onChange}
                size="small"
              />
              <FormControl component="fieldset">
                <RadioGroup
                  row // Hiển thị theo hàng ngang
                  value={fields.type} // Liên kết với state
                  onChange={
                    (e) => setFields({ ...fields, type: e.target.value }) // Cập nhật giá trị khi chọn
                  }
                  name="sex"
                >
                  <FormControlLabel
                    value="Dog"
                    control={<Radio />}
                    label="Dog"
                  />
                  <FormControlLabel
                    value="Cat"
                    control={<Radio />}
                    label="Cat"
                  />
                </RadioGroup>
              </FormControl>
              <TextField
                id="breed"
                label={<span style={{ fontSize: "18px" }}>Breed</span>}
                value={fields.breed}
                onChange={onChange}
                placeholder="Write your pet's breed"
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
              <FormControl component="fieldset">
                <RadioGroup
                  row // Hiển thị theo hàng ngang
                  value={fields.sex} // Liên kết với state
                  onChange={
                    (e) => setFields({ ...fields, sex: e.target.value }) // Cập nhật giá trị khi chọn
                  }
                  name="sex"
                >
                  <FormControlLabel
                    value="Female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="Male"
                    control={<Radio />}
                    label="Male"
                  />
                </RadioGroup>
              </FormControl>
              <Stack direction="row">
                <TextField
                  id="height"
                  value={fields.height}
                  onChange={onChange}
                  placeholder="height"
                  label="Height(cm)"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      padding: "5px",
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "4px",
                    },
                    "& .MuiInputLabel-root": {
                      top: "-5px",
                    },
                    "& .MuiInputLabel-shrink": {
                      top: "0",
                    },
                    margin: "0px 5px",
                  }}
                  inputMode="numeric"
                  multiline
                  fullWidth
                />
                <TextField
                  id="weight"
                  value={fields.weight}
                  onChange={onChange}
                  placeholder="weight"
                  label="Weight(gram)"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      padding: "5px",
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "4px",
                    },
                    "& .MuiInputLabel-root": {
                      top: "-5px",
                    },
                    "& .MuiInputLabel-shrink": {
                      top: "0",
                    },
                    margin: "0px 5px",
                  }}
                  inputMode="numeric"
                  multiline
                  fullWidth
                />
              </Stack>
              <TextField
                id="bio"
                value={fields.bio}
                onChange={onChange}
                placeholder="Say something about your pet"
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

              {selectedImage ? (
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
                </Box>
              ) : fields.profilePicture ? (
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
                    src={fields.profilePicture}
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
                </Box>
              ) : (
                <Typography color="text.secondary">
                  No image selected
                </Typography>
              )}
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
              >
                Post
              </Button>
            </Box>
          </Stack>
        </Card>
      </Modal>
    </>
  );
};

export default PetEditToolDisplay;

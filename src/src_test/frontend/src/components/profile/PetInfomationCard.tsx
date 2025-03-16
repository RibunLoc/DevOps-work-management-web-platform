import React, { useEffect, useState } from "react";
import style from "./css/PetInformationCard.module.css";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Stack,
  Box,
  Button,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Link
} from "@mui/material";
import { blue, green, pink } from "@mui/material/colors";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { Pet } from "../../types";
import { BookmarkBorder, Delete, Edit, MoreVert } from "@mui/icons-material";
import PetsIcon from "@mui/icons-material/Pets";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import PetEditToolDisplay from "./PetEditToolDisplay";
import { createPetUserRelationship, isChecked } from "../../sercives/api";
import Confirmation from "../comfirmation/Confirmation";
import { useSocket } from "../message/SocketContext";

interface Props {
  pet: Pet;
  updatePetsState: (pet: Pet) => void;
}
const PetInfomationCard: React.FC<Props> = (props) => {
  const [pet, setPet] = useState(props.pet);
  const [isDisplayTool, setIsDisplayTool] = useState(false);
  const [isSaved, setIdSaved] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const {initialInput, setInitialInput} = useSocket()
  const handleOpenConfirmModal = () => setIsOpenModal(true);
  const handleCloseConfirmModal = () => setIsOpenModal(false);
  const handleConfirmDelete = () => {
    handleDelete();
  };
  const open = Boolean(anchorEl);
  useEffect(() => {
    fetchData(); // Call fetchData inside useEffect
  }, []);
  const handleSave = async () => {
    const response = await createPetUserRelationship(props.pet._id);
    if (response.newPetUser) {
      setIdSaved(!response.newPetUser.isDeleted)
    }
  };
  const fetchData = async () => {
    const response = await isChecked(
      localStorage.getItem("userId"),
      props.pet._id
    );
    setIdSaved(response.isSaved);
  };

  const toggleDisplayToolBox = () => {
    setIsDisplayTool((prev) => !prev);
  };
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExplorePetClick = (message:string) => {
    debugger;
    setInitialInput(message)
  }
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/pet/delete?petId=${pet._id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      const result = await response.json();
      props.updatePetsState(result.deletedPet);
    } catch (e) {
      console.error(e);
    }
  };
  const calculateAge = (birthDate: string): string => {
    const today = new Date();
    const birth = new Date(birthDate);

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Số ngày trong tháng trước
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return `${years > 0 ? `${years} years` : ""} ${months > 0 ? `${months} months` : ""
      } ${days > 0 ? `${days} days` : ""}`.trim();
  };
  const onUpdatedPet = (newPet: Pet | undefined) => {
    if (newPet != undefined) {
      setPet(newPet);
    }
  };
  return (
    <>
      <Box sx={{ width: "100%", mx: "auto", mt: 4, marginTop: "0px" }}>
        {/* Top post input area */}
        {isDisplayTool && (
          <PetEditToolDisplay
            isOpen={isDisplayTool}
            onClose={toggleDisplayToolBox}
            editPet={pet}
            onUpdatedPet={onUpdatedPet}
          />
        )}
      </Box>
      <Card
        sx={{
          backgroundColor: "#E6F5DE",
          borderRadius: 4,
          boxShadow: 3,
          margin: "0px 0px 40px 0px",
        }}
      >
        <CardHeader
          sx={{ paddingBottom: "0px", padding: "16px 8px 0px" }}
          action={
            <div style={{ position: "relative" }}>
              {/* Nút ba chấm */}
              <IconButton
                onClick={handleMenuClick}
                sx={{ position: "absolute", transform: "translateX(-45px)" }}
              >
                <MoreVert />
              </IconButton>
              {/* Menu với các tùy chọn */}
              {pet.userId === localStorage.getItem("userId") ? (
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem
                    sx={{ justifyContent: "flex-start" }}
                    onClick={toggleDisplayToolBox}
                  >
                    <Edit />
                    Edit
                  </MenuItem>
                  <MenuItem
                    sx={{ justifyContent: "flex-start" }}
                    onClick={handleDelete}
                  >
                    <Delete />
                    Delete
                  </MenuItem>
                </Menu>
              ) : (
                ""
              )}
            </div>
          }
        />

        <CardContent
          sx={{ paddingTop: "0px", padding: "8px 8px 16px !important" }}
        >
          <Stack direction="row" spacing={1}>
            <Avatar
              src={pet.profilePicture} // Replace with your image URL
              alt="Lucy"
              sx={{ width: 200, height: 200, border: "3px solid #fff" }}
            />
            <Stack direction="column" spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h4" color="text.primary">
                  {pet.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="#708258"
                  fontSize="20px"
                  fontWeight="bold"
                >
                  {pet.type}
                </Typography>
                <PetsIcon />
                {pet.sex === "Male" ? (
                  <MaleIcon sx={{ color: blue[500], fontSize: "30px" }} />
                ) : (
                  <FemaleIcon sx={{ color: pink[500], fontSize: "30px" }} />
                )}
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  fontSize="15px"
                  marginLeft="0px !important"
                >
                  {pet.sex}
                </Typography>
                {pet.birthday && (
                  <Typography
                    variant="subtitle1"
                    fontSize="20px"
                    fontWeight="bold"
                  >
                    {calculateAge(pet.birthday)}
                  </Typography>
                )}

                {pet.breed && (
                  <Typography
                    variant="subtitle1"
                    color="#708258"
                    fontSize="25px"
                    fontWeight="bold"
                  >
                    {pet.breed.toUpperCase()}
                  </Typography>

                )}
              </Stack>
              <Typography
                variant="body2"
                color="#708258"
                fontWeight="medium"
                marginTop="0px !important"
                fontSize="18px"
              >
                {pet.bio}
              </Typography>
              <Stack direction="row">
                <Stack direction="column">
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ marginY: 1 }}
                  >
                    {pet.height && (
                      <Chip
                        label={pet.height + "(cm)"}
                        color="primary"
                        icon={
                          <span role="img" aria-label="height">
                            📏
                          </span>
                        }
                      />
                    )}
                    {pet.weight && (
                      <Chip
                        label={pet.weight + "(cm)"}
                        color="primary"
                        icon={
                          <span role="img" aria-label="weight">
                            ⚖️
                          </span>
                        }
                      />
                    )}
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ marginY: 1 }}>
                    <Typography variant="body2">Fur color:</Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: "#fff",
                          borderRadius: "50%",
                        }}
                      />
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: "#000",
                          borderRadius: "50%",
                        }}
                      />
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1} sx={{ marginY: 1 }}>

                    <Button
                      onClick={()=> handleExplorePetClick(pet.breed)}
                    >
                      Explore this pet
                    </Button>

                    
                  </Stack>
                </Stack>
                <Stack direction="column">
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ margin: "5px 0px 0px 10px", fontWeight: "bold" }}
                  >
                    {/* Favorite activities */}
                  </Typography>
                  <ul
                    style={{
                      margin: "0px 0px 0px 10px",
                      padding: "0px",
                      color: blue[700],
                    }}
                  >
                    {/* loading */}
                    {/* <li>Playing fetch</li> */}
                    {/* <li>Cuddling</li> */}
                    {/* <li>Running</li> */}
                  </ul>
                </Stack>
                <IconButton onClick={handleSave}>
                  {isSaved ? (
                    <BookmarkIcon style={{ color: "#F17826" }} />
                  ) : (
                    <BookmarkBorder />
                  )}
                </IconButton>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <Confirmation
        open={isOpenModal}
        onClose={handleClose}
        onConfirm={handleConfirmDelete}
        message="Do you want to delete your pet?"
        title="Do you want to delete?"
      />
    </>
  );
};

export default PetInfomationCard;

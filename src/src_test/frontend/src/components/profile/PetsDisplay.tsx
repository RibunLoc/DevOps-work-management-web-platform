import React, { useContext, useEffect, useState } from "react";
import PetInfomationCard from "./PetInfomationCard";
import { AddPhotoAlternate, AddReaction, Padding } from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  Avatar,
  Box,
  Button,
  Card,
  Icon,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Pet } from "../../types";
import style from "./css/PetsDisplay.module.css";
import PetToolDisplay from "./PetToolDisplay";
import { hover } from "@testing-library/user-event/dist/hover";
import { useParams } from "react-router-dom";
const PetsDisplay = () => {
  const [isDisplayTool, setIsDisplayTool] = useState(false);
  const [petsData, setPetsData] = useState<Pet[]>([]);
  const {userId} = useParams();
  const toggleDisplayToolBox = () => {
    setIsDisplayTool((prev) => !prev);
  };
  const onCreatedPet = (newPet: Pet | undefined) => {
    if (newPet != undefined) {
      setPetsData((prevPosts) => {
        return [...prevPosts, newPet]; 
      });
      fetchData();
    }
  };
  const updatePetsState = (petReturn: Pet) => {
    if(petReturn!=undefined)
    fetchData()
  };
  useEffect(() => {
    fetchData(); // Call fetchData inside useEffect
  }, [userId]);
  const fetchData = async () => {
    //console.log("sdsksjsj",userId)
    const url = `${process.env.REACT_APP_API_URL}/api/v1/pet/getbyuserid?userId=${userId}`;
    try {
      const response = await fetch(url, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Error in getting message");
      }
      const data = await response.json();
      if (data.pets.length > 0) {
        setPetsData(data.pets);
      } else {
        console.log("User don't have any pet");
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };
  return (
    <Box sx={{ width: "100%", mx: "auto", mt: 4,marginTop:"0px" }}>
      {/* Top post input area */}
      {isDisplayTool && (
        <PetToolDisplay
          isOpen={isDisplayTool}
          onClose={toggleDisplayToolBox}
          onCreatedPet={onCreatedPet}
        />
      )}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative", // Relative để làm nền tảng cho các phần tử con
        }}
      >
        {/* Button dấu cộng */}
        
        <Button
        className={style.btnAddPet}
          sx={{
            position: "fixed", // Cố định vị trí so với cửa sổ
            bottom: "10px", // Cách mép trên 10px
            left: "50%", // Canh giữa theo chiều ngang
            transform: "translateX(-50%)", // Dịch để button nằm chính giữa
            zIndex: 1000, // Đảm bảo luôn ở trên các thành phần khác
            backgroundColor: "#E6F5DE", // Màu nền
            color: "#000",
            border: "1px solid #99A67A",
            "&:hover": {
              backgroundColor: "#89966B", // Màu nền
              color: "#B6C79B",
            },
          }}
          variant="contained"
          onClick={toggleDisplayToolBox}
        >
          <AddCircleIcon
            sx={{
              backgroundColor: "#708258", // Màu nền
              "&:hover": {
                backgroundColor: "#5a653f", // Màu nền khi hover
              },
              color: "white", // Màu biểu tượng
              borderRadius: "50%", // Bo tròn nếu cần
            }}
          />
          <div className={style.addTextButton}>Add pet</div>
        </Button>
      </Box>
      <Box sx={{ width: "100%", mx: "auto", mt: 4 }}>
        {petsData != undefined && petsData?.length > 0
          ? petsData?.map((pet, index) => {
              return (
                <PetInfomationCard
                  key={pet._id}
                  pet={pet}
                  updatePetsState={updatePetsState}
                />
              );
            })
          : "User don't have any pet"}
      </Box>
    </Box>
  );
};

export default PetsDisplay;

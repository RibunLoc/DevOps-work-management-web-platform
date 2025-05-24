import React, { useEffect, useState } from "react";
import clsx from 'clsx'

import PetCard from "../../components/favourite/pet/PetCard";
import { PetFavourite } from "../../types";
import { handleDeletePetUserById, handleGetFavouritedPetByUserId } from "../../sercives/api";
import NotFoundComponent from "./NotFoundComponent";
import style from './css/FavouritePetsDisplay.module.css'
const FavouritePetsDisplay = () => {
  const [pets, setPets] = useState<PetFavourite[]>();
  useEffect(() => {
    const fetchData = async () => {
      const result = await handleGetFavouritedPetByUserId();
      //console.log("return dad",response.pets)
      if(result)setPets(result);
    };
    fetchData();
  }, []);
  const onDelete = async (petUserId: String|undefined) => {
    const reponse = await handleDeletePetUserById(petUserId);
    if(reponse.deletedPetUser)
    {
      alert("Xoá thành công")
      setPets((prevPets) => prevPets?.filter((pet) => pet._id !== petUserId));
    } else 
    { alert("Lỗi gì đó")}
  }
  return (
    <div className={clsx(style.container)}>
      {pets && pets.length > 0 ? (
        pets.map((pet, index) => (
          <PetCard key={index} data={pet} onDelete={onDelete} />
        ))
      ) : (
        <NotFoundComponent />
      )}
    </div>
  );
};

export default FavouritePetsDisplay;

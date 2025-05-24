import React from 'react'
import style from './css/PetGeneral.module.css'
const EmptyPetGeneral = () => {
  return (
    <div className={style.petAvatar}>
      <p style={{fontWeight:"500"}}>You don't save any pet</p>
    </div>
  )
}

export default EmptyPetGeneral

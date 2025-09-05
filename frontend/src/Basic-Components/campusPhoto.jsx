import React from 'react'

function CampusPhotoComponent(props) {
     const { campusImg, altText } = props;
     return (
          <div className={`${props.className}`}>
               <img src={campusImg} alt={altText} className="w-full h-[40vh] md:h-[60vh] object-cover" />
          </div>
     )
}
export default CampusPhotoComponent;
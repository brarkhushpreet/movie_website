const getImagePath=(imagePath?:string,fullSize?:boolean)=>{
    return imagePath?`http://image.tmdb.org/t/p/${fullSize?"w1280":"w500" }/${imagePath}`
    :"/No_Image_Available.jpg";
}
export default getImagePath;
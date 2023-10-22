import React, { useState } from "react";
import "../../../css/styles.css";
import "./styles.css";

function SellCar() {
    const [formData, setFormData] = useState({
        make: "",
        model: "",
        year: "",
        mileage: "",
        price: "",
        known_flaws: "",
        description: "",
        modification: "", 
        images: []
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // const handleImageUpload = (event) => {
    //     setFormData({
    //         ...formData,
    //         images: [...event.target.files]
    //     });
    // };
    const [picture, setPicture] = useState(null);
    const [imgData, setImgData] = useState(null);
    // const [prevImg, setPrevImg] = useState(null);
    

    // const handleImageUpload = (event) => {
    //     const files = event.target.files[0];
    //     if (files && files.type.startsWith('image/')) {
    //         console.log("picture: ", event.target.files);
    //     setPicture(event.target.files[0]);
    //     const reader = new FileReader();
    //     reader.addEventListener("load", () => {
    //         setImgData(reader.result);
    //     });
    //     reader.readAsDataURL(event.target.files[0]);
    //     }
    // };
    const handleImageUpload = (index, event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const newImages = [...formData.images];
            newImages[index] = file;
            setFormData({
                ...formData,
                images: newImages
            });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Send formData to your server...
    };

    return (
        <div className="sellcar-page">
            <h2 className="sellcar-title">List Your Car</h2>
            <form onSubmit={handleSubmit}>
                <div className="image-upload-container">
                    {Array(5).fill(null).map((_, index) => (
                        <label key={index} className="label-button">
                            {formData.images[index] ? (
                                <img
                                    className="preview-car-image"
                                    src={URL.createObjectURL(formData.images[index])}
                                    alt={`Car Preview ${index + 1}`}
                                />
                            ) : (
                                "+"
                            )}
                            <input
                                id={`sellcar_image_${index}`}
                                type="file"
                                name="images"
                                onChange={(event) => handleImageUpload(index, event)}
                                className="hidden"
                            />
                        </label>
                    ))}
                </div>
                <h1></h1>
                <div>
                    <input
                        id="sellcar_title"
                        type="text"
                        name="make"
                        value={formData.make}
                        onChange={handleInputChange}
                        placeholder="Make"
                    />
                </div>
                <h1></h1>
                <div>
                    <input
                        id="sellcar_model"
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        placeholder="Car Model"
                    />
                </div>
                <h1></h1>
                <div>
                    <input
                        id="sellcar_year"
                        type="number"  /* assuming year should be a number */
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        placeholder="Year"
                    />
                </div>
                <h1></h1>
                <div>
                    <input
                        id="sellcar_mileage"
                        type="number" /* assuming mileage should be a number */
                        name="mileage"
                        value={formData.mileage}
                        onChange={handleInputChange}
                        placeholder="Mileage"
                    />
                </div>
                <h1></h1>
                <div>
                    <input
                        id="sellcar_price"
                        type="number" /* assuming price should be a number */
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Price (SGD)"
                    />
                </div>
                <h1></h1>
                <div>
                    <textarea
                        id="sellcar_known_flaws"
                        name="known_flaws"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Known Flaws:
                        Dent on rear bumber"
                    ></textarea>
                </div>           
                <div>
                    <textarea
                        id="sellcar_modification"
                        name="modification"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Modification:
                        None"
                    ></textarea>
                </div>
                <div>
                    <textarea
                        id="sellcar_description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                    ></textarea>
                </div>
                <button type="submit">List Your Car</button>
            </form>
        </div>
    );
}
export default SellCar;

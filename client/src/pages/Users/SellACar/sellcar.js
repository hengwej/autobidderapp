import React, { useState } from "react";
import "./styles.css";
import axios from "axios";

function SellCar() {
    const [formData, setFormData] = useState({
        vehicleNumber: "",
        images: null,
        highlights: "",
        equipment: "",
        modification: "",
        known_flaws: "",
        make: "",
        model: "",
        interiorColor: "",
        exteriorColor: "",
        startingBid: "",
        reservePrice: ""
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setFormData({
                ...formData,
                images: file,
            });
        } else {
            alert('Please upload a valid image file.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== 'images') {
                data.append(key, formData[key]);
            }
        });
        if (formData.images) {
            data.append('images', formData.images);
        }
        try {
            const response = await fetch('https://localhost:3000/sellcar', {
                method: 'POST',
                body: data,
            });
            const responseData = await response.json();
            console.log(responseData);
        } catch (error) {
            console.error('Error:', error);
            axios.post('http://localhost:5000/api/cars/sellCar', data, {
                withCredentials: true
            }).then(response => {
                //Handle JSON Response Here
                console.log(response.formData);
            }).catch(error => {
                console.error("Failed to create new entry:", error);
            });
        }
    };

    return (
        <div className="sellcar-page">
            <h2 className="sellCar-title">List Your Car</h2>
            <form onSubmit={handleSubmit}>
                <div className="image-upload-container">
                    <label className="label-button">
                        {formData.images ? (
                            <img
                                className="preview-car-image"
                                src={URL.createObjectURL(formData.images)}
                                alt="Car Preview"
                            />
                        ) : (
                            "+"
                        )}
                        <input
                            id="sellcar_image"
                            type="file"
                            name="images"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </label>
                </div>
                <br></br>
                <h2 className="sellCar-title">Highlights</h2>
                <div>
                    <textarea
                        id="sellcar_highlights"
                        name="highlights"
                        value={formData.highlights}
                        onChange={handleInputChange}
                        placeholder="Fuel Efficiency"
                        className="sellCar-input-margin"
                    ></textarea>
                </div>
                <h2 className="sellCar-title">Equipment</h2>
                <div>
                    <textarea
                        id="sellcar_equipment"
                        name="equipment"
                        value={formData.equipment}
                        onChange={handleInputChange}
                        placeholder="Spare Tyre"
                        className="sellCar-input-margin"
                    ></textarea>
                </div>
                <h2 className="sellCar-title">Modification</h2>
                <div>
                    <textarea
                        id="sellcar_modification"
                        name="modification"
                        value={formData.modification}
                        onChange={handleInputChange}
                        placeholder="Sound system, Tinted windows"
                        className="sellCar-input-margin"
                    ></textarea>
                </div>
                <h2 className="sellCar-title">Known Flaws</h2>
                <div>
                    <textarea
                        id="sellcar_known_flaws"
                        name="known_flaws"
                        value={formData.known_flaws}
                        onChange={handleInputChange}
                        placeholder="Dent on rear bumber"
                        className="sellCar-input-margin"
                    ></textarea>
                </div>
                <h2 className="sellCar-title">Vehicle Number</h2>
                <div>
                    <input
                        id="sellcar_vehicleNumber"
                        type="text"
                        name="vehicleNumber"
                        value={formData.vehicleNumber}
                        onChange={handleInputChange}
                        placeholder="OMP4848M"
                        className="sellCar-input-margin"
                    />
                </div>
                <h2 className="sellCar-title">Make</h2>
                <div>
                    <input
                        id="sellcar_make"
                        type="text"
                        name="make"
                        value={formData.make}
                        onChange={handleInputChange}
                        placeholder="Rolls-Royce"
                        className="sellCar-input-margin"
                    />
                </div>
                <h2 className="sellCar-title">Car Model</h2>
                <div>
                    <input
                        id="sellcar_model"
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        placeholder="Silver Spur 1990"
                        className="sellCar-input-margin"
                    />
                </div>
                <h2 className="sellCar-title">Car Interior Color</h2>
                <div>
                    <input
                        id="sellcar_interiorColor"
                        type="text"
                        name="interiorColor"
                        value={formData.interiorColor}
                        onChange={handleInputChange}
                        placeholder="Black Connolly Hides"
                        className="sellCar-input-margin"
                    />
                </div>
                <h2 className="sellCar-title">Car Exterior Color</h2>
                <div>
                    <input
                        id="sellcar_exteriorColor"
                        type="text"
                        name="exteriorColor"
                        value={formData.exteriorColor}
                        onChange={handleInputChange}
                        placeholder="Dark Blue Metallic"
                        className="sellCar-input-margin"
                    />
                </div>
                <h2 className="sellCar-title">Starting Bid</h2>
                <div>
                    <input
                        id="sellcar_startingBid"
                        type="number"
                        name="startingBid"
                        value={formData.startingBid}
                        onChange={handleInputChange}
                        placeholder="42900"
                        className="sellCar-input-margin"
                    />
                </div>
                <h2 className="sellCar-title">Reserve Price</h2>
                <div>
                    <input
                        id="sellcar_reservePrice"
                        type="number"
                        name="reservePrice"
                        value={formData.reservePrice}
                        onChange={handleInputChange}
                        placeholder="250000"
                        className="sellCar-input-margin"
                    />
                </div>
                <br></br>
                <button type="submit" className="list-your-car-button">List Your Car</button>
            </form>
        </div>
    );
}
export default SellCar;

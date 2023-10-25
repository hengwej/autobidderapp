import React, { useState, useCallback } from "react";
import "./styles.css";
import axios from "axios";
import * as Yup from 'yup';
import DOMPurify from 'dompurify';
import { debounce } from 'lodash';

const MAX_FILE_SIZE = 5 * 1024 * 1024;  // 5 MB in bytes

const formSchema = Yup.object().shape({
    vehicleNumber: Yup.string()
        .matches(/^[A-Z]{1,3}[0-9]{1,4}[A-Z]$/, "Invalid Singapore vehicle number format: TES1234T")
        .max(8, 'Vehicle number cannot exceed 8 characters')
        .required('Vehicle number is required'),
    images: Yup.mixed()
        .test("fileSize", "File too large", value => value && value.size <= MAX_FILE_SIZE)
        .required('Image is required'),
    highlights: Yup.string()
        .max(188, 'Highlights cannot exceed 188 characters')
        .required('Highlights are required'),
    equipment: Yup.string()
        .max(188, 'Equipment details cannot exceed 188 characters')
        .required('Equipment are required'),
    modification: Yup.string()
        .max(188, 'Modifications cannot exceed 188 characters')
        .required('Modification are required'),
    known_flaws: Yup.string()
        .max(188, 'Known flaws cannot exceed 188 characters')
        .required('Known_flaws are required'),
    make: Yup.string()
        .max(50, 'Make cannot exceed 50 characters')
        .required('Make are required'),
    model: Yup.string()
        .max(50, 'Model cannot exceed 50 characters')
        .required('Model are required'),
    interiorColor: Yup.string()
        .max(50, 'Interior Color cannot exceed 50 characters')
        .required('Interior Color are required'),
    exteriorColor: Yup.string()
        .max(50, 'Exterior Color cannot exceed 50 characters')
        .required('Exterior Color are required'),
    startingBid: Yup.number()
        .min(1, 'Starting bid must be at least 1')
        .required('Starting Bid are required'),
    reservePrice: Yup.number()
        .min(5, 'Reserve price must be at least 5')
        .max(1000000, 'Reserve price cannot exceed 1000000')
        .required('Reserve price are required'),
});

// Sanitize function
const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
};

function SellCar() {
    const [errors, setErrors] = useState({});

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

    const validateField = (name, value) => {
        const schema = Yup.reach(formSchema, name);  // Get the schema for this field from formSchema
        schema.validate(value)
            .then(() => {
                setErrors(prevErrors => {
                    const newErrors = { ...prevErrors };
                    delete newErrors[name];  // Remove any existing error for this field
                    return newErrors;
                });
            })
            .catch(error => {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [name]: error.message  // Add or update error message for this field
                }));
            });
    };

    // input validation for number fields
    const handleNumberChange = useCallback((event) => {
        const { name, value } = event.target;
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= 0) {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: numValue
            }));
            validateField(name, numValue);  // Validate this field
        }
    }, []);

    const debouncedNumberChange = debounce(handleNumberChange, 300, { leading: true });
    const handleInputChange = useCallback((event) => { // Wrap with useCallback to prevent re-creation on each render
        const { name, value } = event.target;
        const sanitizedValue = sanitizeInput(value); // Sanitize the input value
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: sanitizedValue // Update state with sanitized value
        }));
        validateField(name, sanitizedValue);  // Validate this field
    }, []);  // No dependencies here as setFormData does not change

    const debouncedHandleInputChange = debounce(handleInputChange, 300, { leading: true });  // Create debounced function
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/') && file.size <= MAX_FILE_SIZE) {
            setFormData({
                ...formData,
                images: file,
            });
        } else {
            alert('Please upload a valid image file under ' + (MAX_FILE_SIZE / 1024 / 1024) + ' MB.');
        }
    };

    const [submissionStatus, setSubmissionStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmissionStatus('');  // reset submission status
        setLoading(true);  // set loading to true
        setSuccess(false);  // reset success and error states
        setError(null);
        try {
            // Validate formData using the schema
            await formSchema.validate(formData);
            // If validation is successful, proceed with form submission
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
                // console.log(responseData);
                setSuccess(true);  // set success to true on successful submission
                setSubmissionStatus('success');  // set submission status to success on successful submission
            } catch (error) {
                console.error('Error:', error);
                axios.post('http://localhost:5000/api/cars/sellCar', data, {
                    withCredentials: true
                }).then(response => {
                    //Handle JSON Response Here
                    // console.log(response.formData);
                }).catch(error => {
                    // console.error("Failed to create new entry:", error);
                    // setError(error.message);  // set error on failure
                    setSubmissionStatus('failure');  // set submission status to failure on error
                });
            }
        } catch (validationError) {
            // If validation fails, validationError.message will contain the validation error message
            console.error('Validation Error:', validationError.message);
        }
        setLoading(false);  // set loading back to false at the end
    };
    return (
        <div className="sellcar-page">
            {success && <div className="success">Car listed successfully!</div>}
            {error && <div className="error">Error: {error}</div>}
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
                    {errors.images && <div className="error-message">{errors.images}</div>}
                </div>
                <br></br>
                <h2 className="sellCar-title">Highlights</h2>
                <div>
                    <textarea
                        id="sellcar_highlights"
                        name="highlights"
                        value={formData.highlights}
                        onChange={debouncedHandleInputChange}
                        placeholder="Fuel Efficiency"
                        className="sellCar-input-margin"
                    ></textarea>
                    {errors.highlights && <div className="error-message">{errors.highlights}</div>}
                </div>
                <h2 className="sellCar-title">Equipment</h2>
                <div>
                    <textarea
                        id="sellcar_equipment"
                        name="equipment"
                        value={formData.equipment}
                        onChange={debouncedHandleInputChange}
                        placeholder="Spare Tyre"
                        className="sellCar-input-margin"
                    ></textarea>
                    {errors.equipment && <div className="error-message">{errors.equipment}</div>}
                </div>
                <h2 className="sellCar-title">Modification</h2>
                <div>
                    <textarea
                        id="sellcar_modification"
                        name="modification"
                        value={formData.modification}
                        onChange={debouncedHandleInputChange}
                        placeholder="Sound system, Tinted windows"
                        className="sellCar-input-margin"
                    ></textarea>
                    {errors.modification && <div className="error-message">{errors.modification}</div>}
                </div>
                <h2 className="sellCar-title">Known Flaws</h2>
                <div>
                    <textarea
                        id="sellcar_known_flaws"
                        name="known_flaws"
                        value={formData.known_flaws}
                        onChange={debouncedHandleInputChange}
                        placeholder="Dent on rear bumber"
                        className="sellCar-input-margin"
                    ></textarea>
                    {errors.known_flaws && <div className="error-message">{errors.known_flaws}</div>}
                </div>
                <h2 className="sellCar-title">Vehicle Number</h2>
                <div>
                    <input
                        id="sellcar_vehicleNumber"
                        type="text"
                        name="vehicleNumber"
                        value={formData.vehicleNumber}
                        onChange={debouncedHandleInputChange}
                        placeholder="OMP4848M"
                        className="sellCar-input-margin"
                    />
                    {errors.vehicleNumber && <div className="error-message">{errors.vehicleNumber}</div>}
                </div>
                <h2 className="sellCar-title">Make</h2>
                <div>
                    <input
                        id="sellcar_make"
                        type="text"
                        name="make"
                        value={formData.make}
                        onChange={debouncedHandleInputChange}
                        placeholder="Rolls-Royce"
                        className="sellCar-input-margin"
                    />
                    {errors.make && <div className="error-message">{errors.make}</div>}
                </div>
                <h2 className="sellCar-title">Car Model</h2>
                <div>
                    <input
                        id="sellcar_model"
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={debouncedHandleInputChange}
                        placeholder="Silver Spur 1990"
                        className="sellCar-input-margin"
                    />
                    {errors.model && <div className="error-message">{errors.model}</div>}
                </div>
                <h2 className="sellCar-title">Car Interior Color</h2>
                <div>
                    <input
                        id="sellcar_interiorColor"
                        type="text"
                        name="interiorColor"
                        value={formData.interiorColor}
                        onChange={debouncedHandleInputChange}
                        placeholder="Black Connolly Hides"
                        className="sellCar-input-margin"
                    />
                    {errors.interiorColor && <div className="error-message">{errors.interiorColor}</div>}
                </div>
                <h2 className="sellCar-title">Car Exterior Color</h2>
                <div>
                    <input
                        id="sellcar_exteriorColor"
                        type="text"
                        name="exteriorColor"
                        value={formData.exteriorColor}
                        onChange={debouncedHandleInputChange}
                        placeholder="Dark Blue Metallic"
                        className="sellCar-input-margin"
                    />
                    {errors.exteriorColor && <div className="error-message">{errors.exteriorColor}</div>}
                </div>
                <h2 className="sellCar-title">Starting Bid</h2>
                <div>
                    <input
                        id="sellcar_startingBid"
                        type="number"
                        name="startingBid"
                        value={formData.startingBid}
                        onChange={debouncedNumberChange}
                        placeholder="42900"
                        className="sellCar-input-margin"
                    />
                    {errors.startingBid && <div className="error-message">{errors.startingBid}</div>}
                </div>
                <h2 className="sellCar-title">Reserve Price</h2>
                <div>
                    <input
                        id="sellcar_reservePrice"
                        type="number"
                        name="reservePrice"
                        value={formData.reservePrice}
                        onChange={debouncedNumberChange}
                        placeholder="250000"
                        className="sellCar-input-margin"
                    />
                    {errors.reservePrice && <div className="error-message">{errors.reservePrice}</div>}
                </div>
                <br></br>
                <button type="submit" className={`list-your-car-button ${submissionStatus}`}>
                    {loading ? 'Loading...' : submissionStatus === 'success' ? 'Success!' : submissionStatus === 'failure' ? 'Failure' : 'List Your Car'}
                </button>
            </form>
        </div>
    );
}
export default SellCar;
import React, { useState } from "react";
import { statsPropeties } from "../constants/constants";

const AddStatsForm = ({ addStats }) => {
  const [formData, setFormData] = useState(statsPropeties);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (Object.keys(formData).every((key) => formData[key])) {
      addStats(formData);
      setFormData(statsPropeties);
    }
  };

  return (
    <div>
      <h2>Add New Stats</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            type="text"
            name={key}
            placeholder={key}
            value={formData[key]}
            onChange={handleInputChange}
          />
        ))}

        <button type="submit">Add Stats</button>
      </form>
    </div>
  );
};

export default AddStatsForm;

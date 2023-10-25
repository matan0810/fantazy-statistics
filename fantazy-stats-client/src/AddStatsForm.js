import React, { useState } from 'react';

const AddStatsForm = ({ addStats }) => {
  const [formData, setFormData] = useState({
    playerName: '',
    points: '',
  });

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addStats(formData);
    setFormData({
      playerName: '',
      points: '',
    });
  };

  return (
    <div>
      <h2>Add New Stats</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="playerName"
          placeholder="Player Name"
          value={formData.playerName}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="points"
          placeholder="Points"
          value={formData.points}
          onChange={handleInputChange}
        />
        <button type="submit">Add Stats</button>
      </form>
    </div>
  );
};

export default AddStatsForm;

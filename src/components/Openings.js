import React, { useState } from "react";
import db from '../firebase';
import { collection, addDoc } from "firebase/firestore";
const Openings = () => {
  const [openingData, setOpeningData] = useState({
    company: "",
    designation: "",
    reqReceivedDate: "",
    profileSharedDate: "",
    jd: "",
    mandatorySkillSet: "",
    shiftTimings: "",
    contractFTE: "",
    duration: "",
    budget: "",
    numberOfPositions: "",
    endClientDetails: "",
    lineupProfiles: "",
    profileStatus: "",
    workType: "",
    progressStatus: "",
    bgv: "",
    l1Questions: "",
    l2Questions: "",
    totalRelExp: "",
    note: "",
    jdAttachment: null,
    laptopProvided: "",
    noOfTechnicalRounds: "",
  });

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOpeningData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setOpeningData((prevData) => ({
      ...prevData,
      jdAttachment: file,
    }));
  };

  // Handle form reset
  const handleClear = () => {
    setOpeningData({
      company: "",
      designation: "",
      reqReceivedDate: "",
      profileSharedDate: "",
      jd: "",
      mandatorySkillSet: "",
      shiftTimings: "",
      contractFTE: "",
      duration: "",
      budget: "",
      numberOfPositions: "",
      endClientDetails: "",
      lineupProfiles: "",
      profileStatus: "",
      workType: "",
      progressStatus: "",
      bgv: "",
      l1Questions: "",
      l2Questions: "",
      totalRelExp: "",
      note: "",
      jdAttachment: null,
      laptopProvided: "",
      noOfTechnicalRounds: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    try {
      // Save data to Firestore (in a collection called "openings")
      await addDoc(collection(db, "openings"), {
        company: openingData.company,
        designation: openingData.designation,
        reqReceivedDate: openingData.reqReceivedDate,
        profileSharedDate: openingData.profileSharedDate,
        jd: openingData.jd,
        mandatorySkillSet: openingData.mandatorySkillSet,
        shiftTimings: openingData.shiftTimings,
        contractFTE: openingData.contractFTE,
        duration: openingData.duration,
        budget: openingData.budget,
        numberOfPositions: openingData.numberOfPositions,
        endClientDetails: openingData.endClientDetails,
        lineupProfiles: openingData.lineupProfiles,
        profileStatus: openingData.profileStatus,
        workType: openingData.workType,
        progressStatus: openingData.progressStatus,
        bgv: openingData.bgv,
        l1Questions: openingData.l1Questions,
        l2Questions: openingData.l2Questions,
        totalRelExp: openingData.totalRelExp,
        note: openingData.note,
        jdAttachment: openingData.jdAttachment
          ? openingData.jdAttachment.name
          : null, // Save only the file name (not the actual file)
        laptopProvided: openingData.laptopProvided,
        noOfTechnicalRounds: openingData.noOfTechnicalRounds,
        timestamp: new Date(), // Add a timestamp for when the entry was created
      });
  
      alert("Form submitted successfully!");
  
      // Reset the form fields
      handleClear();
    } catch (error) {
      console.error("Error saving data to Firebase:", error);
      alert("Failed to submit the form");
    }
  };

  const addTestData = async () => {
    try {
      await addDoc(collection(db, "testCollection"), {
        message: "Hello, new Firebase database!",
      });
      alert("Data added to the new database successfully!");
    } catch (error) {
      console.error("Error adding data to Firestore:", error);
      alert("Failed to add data to the new database.");
    }
  };
  

  return (
    <div className="container mt-5"
    style={{
      marginTop:"100px",
      paddingRight: "15px",
      borderRadius: "0px",
    }}>
      <h2 className="mb-4">New Requirement</h2>
  {/* Add Test Data Button */}
 
      
      <form onSubmit={handleSubmit}>
        {/* Form Elements in 3 Columns */}
        <div
        style={{
          maxHeight: "500px",
          overflowY: "scroll",
          paddingRight: "15px",
          borderRadius: "0px",
        }}
      >
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Company</label>
            <input
              type="text"
              className="form-control"
              name="company"
              value={openingData.company}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Designation</label>
            <input
              type="text"
              className="form-control"
              name="designation"
              value={openingData.designation}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Req. Received Date</label>
            <input
              type="date"
              className="form-control"
              name="reqReceivedDate"
              value={openingData.reqReceivedDate}
              onChange={handleInputChange}
            />
          </div>
        </div>
  
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Profile Shared Date</label>
            <input
              type="date"
              className="form-control"
              name="profileSharedDate"
              value={openingData.profileSharedDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Mandatory Skill Set</label>
            <textarea
              className="form-control"
              name="mandatorySkillSet"
              rows="3"
              value={openingData.mandatorySkillSet}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div className="col-md-4">
            <label className="form-label">Total/Rel Exp</label>
            <input
              type="text"
              className="form-control"
              name="totalRelExp"
              value={openingData.totalRelExp}
              onChange={handleInputChange}
            />
          </div>
        </div>
  
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Shift Timings</label>
            <input
              type="text"
              className="form-control"
              name="shiftTimings"
              value={openingData.shiftTimings}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Engagement Type</label>
            <select
              className="form-select"
              name="contractFTE"
              value={openingData.contractFTE}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Contract">Contract</option>
              <option value="FTE">FTE</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Freelancer">Freelancer</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Duration (if Contract)</label>
            <input
              type="text"
              className="form-control"
              name="duration"
              value={openingData.duration}
              onChange={handleInputChange}
            />
          </div>
        </div>
  
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Budget (Hrs/Month/Annum)</label>
            <input
              type="text"
              className="form-control"
              name="budget"
              value={openingData.budget}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">No. of Positions</label>
            <input
              type="number"
              className="form-control"
              name="numberOfPositions"
              value={openingData.numberOfPositions}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">End Client Details</label>
            <input
              type="text"
              className="form-control"
              name="endClientDetails"
              value={openingData.endClientDetails}
              onChange={handleInputChange}
            />
          </div>
        </div>
  
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Lineup Profiles</label>
            <input
              type="text"
              className="form-control"
              name="lineupProfiles"
              value={openingData.lineupProfiles}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Status of Profiles</label>
            <input
              type="text"
              className="form-control"
              name="profileStatus"
              value={openingData.profileStatus}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Work Type</label>
            <input
              type="text"
              className="form-control"
              name="workType"
              value={openingData.workType}
              onChange={handleInputChange}
            />
          </div>
        </div>
  
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Progress Status</label>
            <input
              type="text"
              className="form-control"
              name="progressStatus"
              value={openingData.progressStatus}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">BGV</label>
            <div className="form-check">
              <input
                type="radio"
                id="bgvYes"
                name="bgv"
                value="Yes"
                checked={openingData.bgv === "Yes"}
                onChange={handleInputChange}
              />
              <label className="form-check-label" htmlFor="bgvYes">Yes</label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                id="bgvNo"
                name="bgv"
                value="No"
                checked={openingData.bgv === "No"}
                onChange={handleInputChange}
              />
              <label className="form-check-label" htmlFor="bgvNo">No</label>
            </div>
          </div>
          <div className="col-md-4">
            <label className="form-label">Laptop</label>
            <div className="form-check">
              <input
                type="radio"
                id="laptopYes"
                name="laptop"
                value="Yes"
                checked={openingData.laptop === "Yes"}
                onChange={handleInputChange}
              />
              <label className="form-check-label" htmlFor="laptopYes">Yes</label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                id="laptopNo"
                name="laptop"
                value="No"
                checked={openingData.laptop === "No"}
                onChange={handleInputChange}
              />
              <label className="form-check-label" htmlFor="laptopNo">No</label>
            </div>
          </div>
        </div>
  
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">JD</label>
            <textarea
              className="form-control"
              name="jd"
              rows="3"
              value={openingData.jd}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div className="col-md-4">
            <label className="form-label">JD Attachment</label>
            <input
              type="file"
              className="form-control"
              name="jdAttachment"
              onChange={handleFileChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Note</label>
            <textarea
              className="form-control"
              name="note"
              rows="3"
              value={openingData.note}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>
  
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">No. of Technical Rounds</label>
            <input
              type="number"
              className="form-control"
              name="noOfTechnicalRounds"
              value={openingData.noOfTechnicalRounds}
              onChange={handleInputChange}
            />
          </div>
        </div>
  
        </div>

      {/* Buttons */}
      <div className="d-flex justify-content-end mt-3">
          {/* Clear Button */}
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={handleClear}
          >
            Clear
          </button>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
      
    </div>
  );
};

export default Openings;
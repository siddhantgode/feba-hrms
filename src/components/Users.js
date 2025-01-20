import React, { useState } from "react";

const ResourceTrackingForm = () => {
  const [formData, setFormData] = useState({
    client: "",
    requirement: "",
    candidateFullName: "",
    sharedDateTA: "",
    totalRelExp: "",
    npLwd: "",
    contactNumber1: "",
    contactNumber2: "",
    email1: "",
    email2: "",
    linkedIn: "",
    resumeAttachment: null,
    photograph: null,
    panUpload: null,
    aadhaarUpload: null,
    consultantType: "",
    skillStack: "",
    currentLocation: "",
    preferredLocation: "",
    education: "",
    currentShift: "",
    preferredShifts: "",
    address: "",
    passportVisa: "",
    holdingOffers: "",
    ctc: "",
    inhand: "",
    etc: "",
    rateClosed: "",
    consultant: "",
    domainExp: "",
    resourceStatus: "",
    bgv: "",
    pan: "",
    adhaar: "",
    nearestClientOffice: "",
    currentCompany: "",
  });

  const [resumePreview, setResumePreview] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [panPreview, setPanPreview] = useState(null);
  const [aadhaarPreview, setAadhaarPreview] = useState(null);

  const [skills, setSkills] = useState([{ skillName: "", experienceYears: "" }]);
  const [showSkillModal, setShowSkillModal] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));

    if (name === "resumeAttachment") setResumePreview(URL.createObjectURL(file));
    if (name === "photograph") setPhotoPreview(URL.createObjectURL(file));
    if (name === "panUpload") setPanPreview(URL.createObjectURL(file));
    if (name === "aadhaarUpload") setAadhaarPreview(URL.createObjectURL(file));
  };

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index][field] = value;
    setSkills(updatedSkills);
  };

  const handleAddSkill = () => {
    setSkills([...skills, { skillName: "", experienceYears: "" }]);
  };

  const toggleSkillModal = () => {
    setShowSkillModal(!showSkillModal);
  };

  const handleSaveSkills = () => {
    const skillStackString = skills
      .map((skill) => `${skill.skillName} (${skill.experienceYears} years)`)
      .join(", ");
    setFormData((prev) => ({
      ...prev,
      skillStack: skillStackString,
    }));
    toggleSkillModal();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    console.log("Skill Stack:", skills);
    alert("Form submitted successfully!");
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Resource Tracking Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Client and Requirement */}
        <div className="row mb-3"
        style={{
          maxHeight: "500px",
          overflowY: "scroll",
          paddingRight: "15px",
          borderRadius: "0px",
        }}>
          <div className="col-md-6">
            <label className="form-label">Client</label>
            <input
              type="text"
              className="form-control"
              name="client"
              value={formData.client}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Requirement</label>
            <input
              type="text"
              className="form-control"
              name="requirement"
              value={formData.requirement}
              onChange={handleInputChange}
            />
          </div>
        </div>
  
        {/* Candidate Full Name and Shared Date & TA */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Candidate Full Name</label>
            <input
              type="text"
              className="form-control"
              name="candidateFullName"
              value={formData.candidateFullName}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Shared Date & TA</label>
            <input
              type="date"
              className="form-control"
              name="sharedDateTA"
              value={formData.sharedDateTA}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Status and Mode Dropdowns */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Status: FTE/Consultant/Freelancer</label>
          <select
            className="form-control"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="">Select Status</option>
            <option value="FTE">FTE</option>
            <option value="Consultant">Consultant</option>
            <option value="Freelancer">Freelancer</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Mode: Current Location/Remote/Hybrid/WFO</label>
          <select
            className="form-control"
            name="mode"
            value={formData.mode}
            onChange={handleInputChange}
          >
            <option value="">Select Mode</option>
            <option value="Current Location">Current Location</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="WFO">WFO</option>
          </select>
        </div>
      </div>
      {/* Education */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Education</label>
          <input
            type="text"
            className="form-control"
            name="education"
            value={formData.education}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Current Shift and Preferred Shifts */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Current Shift</label>
          <input
            type="text"
            className="form-control"
            name="currentShift"
            value={formData.currentShift}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Preferred Shifts</label>
          <input
            type="text"
            className="form-control"
            name="preferredShifts"
            value={formData.preferredShifts}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Address */}
      <div className="row mb-3">
        <div className="col-md-12">
          <label className="form-label">Address</label>
          <textarea
            className="form-control"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows="3"
          ></textarea>
        </div>
      </div>

      {/* Passport/Visa */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Passport/Visa</label>
          <input
            type="text"
            className="form-control"
            name="passportVisa"
            value={formData.passportVisa}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Holding Offers, CTC, ETC */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">Holding Offers</label>
          <input
            type="text"
            className="form-control"
            name="holdingOffers"
            value={formData.holdingOffers}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">CTC</label>
          <input
            type="text"
            className="form-control"
            name="ctc"
            value={formData.ctc}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">ETC</label>
          <input
            type="text"
            className="form-control"
            name="etc"
            value={formData.etc}
            onChange={handleInputChange}
          />
        </div>
      </div>


      {/* Domain Exp and Status of Resource */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Domain Exp</label>
          <select
            className="form-control"
            name="domainExp"
            value={formData.domainExp}
            onChange={handleInputChange}
          >
            <option value="">Select Domain</option>
            <option value="Banking">Banking</option>
            <option value="E commerce">E commerce</option>
            <option value="Pharma">Pharma</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Construction">Construction</option>
            <option value="Real Estate">Real Estate</option>
            <option value="IT">IT</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Status of Resource</label>
          <select
            className="form-control"
            name="resourceStatus"
            value={formData.resourceStatus}
            onChange={handleInputChange}
          >
            <option value="">Select Status</option>
            <option value="L1 through">L1 through</option>
            <option value="L2 through">L2 through</option>
            <option value="Rejected">Rejected</option>
            <option value="Hold">Hold</option>
            <option value="Selected">Selected</option>
            <option value="Client Round">Client Round</option>
            <option value="Onboarded">Onboarded</option>
            <option value="Client round Pending">Client round Pending</option>
            <option value="BGV Initiated">BGV Initiated</option>
            <option value="Offer Shared">Offer Shared</option>
            <option value="Docs Received">Docs Received</option>
            <option value="BackedOut">BackedOut</option>
            <option value="Rate shared">Rate shared</option>
            <option value="Laptop allocated">Laptop allocated</option>
          </select>
        </div>
      </div>

      
  
       
        {/* Total/Rel Exp and NP (Negotiable NP)/LWD */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Total/Rel Exp</label>
            <input
              type="text"
              className="form-control"
              name="totalRelExp"
              value={formData.totalRelExp}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">NP (Negotiable NP)/LWD</label>
            <input
              type="text"
              className="form-control"
              name="npLwd"
              value={formData.npLwd}
              onChange={handleInputChange}
            />
          </div>
        </div>
  
        {/* Contact Numbers */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Contact No.1</label>
            <input
              type="text"
              className="form-control"
              name="contactNumber1"
              value={formData.contactNumber1}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Contact No.2</label>
            <input
              type="text"
              className="form-control"
              name="contactNumber2"
              value={formData.contactNumber2}
              onChange={handleInputChange}
            />
          </div>
        </div>
  
        {/* Emails and LinkedIn */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Email 1</label>
            <input
              type="email"
              className="form-control"
              name="email1"
              value={formData.email1}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email 2</label>
            <input
              type="email"
              className="form-control"
              name="email2"
              value={formData.email2}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Linked IN</label>
            <input
              type="url"
              className="form-control"
              name="linkedIn"
              value={formData.linkedIn}
              onChange={handleInputChange}
            />
          </div>
        </div>
  
        {/* Skill Stack */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">
              Skill Stack
              <button
                type="button"
                className="btn btn-sm btn-primary ms-2"
                onClick={toggleSkillModal}
              >
                Add Skills
              </button>
            </label>
            <input
              type="text"
              className="form-control"
              name="skillStack"
              value={formData.skillStack}
              onChange={handleInputChange}
              readOnly
            />
          </div>
        </div>
  
        {/* Photograph, PAN, Aadhaar, Resume */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Photograph</label>
            <input
              type="file"
              className="form-control"
              name="photograph"
              onChange={handleFileChange}
            />
            {photoPreview && (
              <a
                href={photoPreview}
                target="_blank"
                rel="noopener noreferrer"
                className="d-block mt-2"
              >
                View Uploaded Photograph
              </a>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label">PAN</label>
            <input
              type="file"
              className="form-control"
              name="panUpload"
              onChange={handleFileChange}
            />
            {panPreview && (
              <a
                href={panPreview}
                target="_blank"
                rel="noopener noreferrer"
                className="d-block mt-2"
              >
                View Uploaded PAN
              </a>
            )}
          </div>
        </div>
  
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Aadhaar</label>
            <input
              type="file"
              className="form-control"
              name="aadhaarUpload"
              onChange={handleFileChange}
            />
            {aadhaarPreview && (
              <a
                href={aadhaarPreview}
                target="_blank"
                rel="noopener noreferrer"
                className="d-block mt-2"
              >
                View Uploaded Aadhaar
              </a>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label">Resume Attachment</label>
            <input
              type="file"
              className="form-control"
              name="resumeAttachment"
              onChange={handleFileChange}
            />
            {resumePreview && (
              <a
                href={resumePreview}
                target="_blank"
                rel="noopener noreferrer"
                className="d-block mt-2"
              >
                View Uploaded Resume
              </a>
            )}
          </div>
        </div>
  
        {/* Submit Button */}
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
  
      {/* Skill Stack Modal */}
      {showSkillModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Skill Stack Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={toggleSkillModal}
                ></button>
              </div>
              <div className="modal-body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Skill Name</th>
                      <th>Experience in Years</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((skill, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={skill.skillName}
                            onChange={(e) =>
                              handleSkillChange(index, "skillName", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={skill.experienceYears}
                            onChange={(e) =>
                              handleSkillChange(index, "experienceYears", e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAddSkill}
                >
                  Add New
                </button>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSaveSkills}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={toggleSkillModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceTrackingForm;
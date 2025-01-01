import React, { useState } from "react";
import { useCommunication } from "../context/data";
import "./adminModule.css";

function AdminModule() {
  const {
    state,
    addCompany,
    updateCompany,
    deleteCompany,
    updateCommunicationMethod,
    deleteCommunicationMethod,
    addCommunicationMethod,
  } = useCommunication();

  // Company Management State
  const [companyForm, setCompanyForm] = useState({
    id: "",
    name: "",
    location: "",
    linkedinProfile: "",
    emails: [""],
    phoneNumbers: [""],
    comments: "",
    communicationPeriodicity: 14,
  });

  // Communication Method Management State
  const [methodForm, setMethodForm] = useState({
    id: "",
    name: "",
    description: "",
    sequence: 0,
    isMandatory: false,
  });

  // Edit Mode States
  const [editingCompany, setEditingCompany] = useState(false);
  const [editingMethod, setEditingMethod] = useState(false);

  // Collapsible Form States
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showMethodForm, setShowMethodForm] = useState(false);

  // Company Form Handlers
  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...companyForm.emails];
    newEmails[index] = value;
    setCompanyForm((prev) => ({ ...prev, emails: newEmails }));
  };

  const handleAddEmail = () => {
    setCompanyForm((prev) => ({
      ...prev,
      emails: [...prev.emails, ""],
    }));
  };

  const handleRemoveEmail = (index) => {
    const newEmails = companyForm.emails.filter((_, i) => i !== index);
    setCompanyForm((prev) => ({ ...prev, emails: newEmails }));
  };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...companyForm.phoneNumbers];
    newPhones[index] = value;
    setCompanyForm((prev) => ({ ...prev, phoneNumbers: newPhones }));
  };

  const handleAddPhone = () => {
    setCompanyForm((prev) => ({
      ...prev,
      phoneNumbers: [...prev.phoneNumbers, ""],
    }));
  };

  const handleRemovePhone = (index) => {
    const newPhones = companyForm.phoneNumbers.filter((_, i) => i !== index);
    setCompanyForm((prev) => ({ ...prev, phoneNumbers: newPhones }));
  };

  const handleAddCompany = (e) => {
    e.preventDefault();
    if (!companyForm.name || !companyForm.location) {
      alert("Company Name and Location are required.");
      return;
    }

    if (editingCompany) {
      updateCompany(companyForm);
      setEditingCompany(false);
    } else {
      addCompany(companyForm);
    }

    // Reset form and hide it
    setCompanyForm({
      id: "",
      name: "",
      location: "",
      linkedinProfile: "",
      emails: [""],
      phoneNumbers: [""],
      comments: "",
      communicationPeriodicity: 14,
    });
    setShowCompanyForm(false);
  };

  const startEditCompany = (company) => {
    setCompanyForm(company);
    setEditingCompany(true);
    setShowCompanyForm(true);
  };

  // Communication Method Form Handlers
  const handleMethodChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMethodForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddNewCommunicationMethod = (e) => {
    e.preventDefault();
    if (!methodForm.name) {
      alert("Method Name is required.");
      return;
    }

    if (editingMethod) {
      updateCommunicationMethod(methodForm);
      setEditingMethod(false);
    } else {
      addCommunicationMethod({
        ...methodForm,
        sequence:
          methodForm.sequence || state.communicationMethods.length + 1,
      });
    }

    // Reset form and hide it
    setMethodForm({
      id: "",
      name: "",
      description: "",
      sequence: 0,
      isMandatory: false,
    });
    setShowMethodForm(false);
  };

  const startEditMethod = (method) => {
    setMethodForm(method);
    setEditingMethod(true);
    setShowMethodForm(true);
  };

  return (
    <div className="admin-module">
      <h1>Admin Module</h1>

      <section className="company-management">
        <h2>Company Management</h2>
        <button
          className="toggle-form-btn"
          onClick={() => setShowCompanyForm(!showCompanyForm)}
        >
          {showCompanyForm ? "Hide Form" : "Add Company"}
        </button>
        <form
          onSubmit={handleAddCompany}
          className={`collapsible-form ${showCompanyForm ? "open" : ""}`}
        >
          <label>
            Company Name:
            <input
              type="text"
              name="name"
              value={companyForm.name}
              onChange={handleCompanyChange}
              placeholder="Enter Company Name"
              required
            />
          </label>
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={companyForm.location}
              onChange={handleCompanyChange}
              placeholder="Enter Location"
              required
            />
          </label>
          <label>
            LinkedIn Profile:
            <input
              type="url"
              name="linkedinProfile"
              value={companyForm.linkedinProfile}
              onChange={handleCompanyChange}
              placeholder="Enter LinkedIn Profile URL"
            />
          </label>

          <div className="email-management">
            <h4>Emails</h4>
            {companyForm.emails.map((email, index) => (
              <div key={index} className="input-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  placeholder="Enter Email Address"
                />
                {companyForm.emails.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(index)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddEmail} className="add-btn">
              Add Email
            </button>
          </div>

          <div className="phone-management">
            <h4>Phone Numbers</h4>
            {companyForm.phoneNumbers.map((phone, index) => (
              <div key={index} className="input-group">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(index, e.target.value)}
                  placeholder="Enter Phone Number"
                />
                {companyForm.phoneNumbers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePhone(index)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddPhone} className="add-btn">
              Add Phone
            </button>
          </div>

          <label>
            Communication Periodicity (days):
            <input
              type="number"
              name="communicationPeriodicity"
              value={companyForm.communicationPeriodicity}
              onChange={handleCompanyChange}
              min="1"
              required
            />
          </label>
          <label>
            Comments:
            <textarea
              name="comments"
              value={companyForm.comments}
              onChange={handleCompanyChange}
              placeholder="Enter Additional Comments"
            />
          </label>
          <button type="submit" className="submit-btn">
            {editingCompany ? "Update Company" : "Add Company"}
          </button>
          {editingCompany && (
            <button
              type="button"
              onClick={() => setEditingCompany(false)}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
        </form>

        <div className="company-list">
          <h3>Existing Companies</h3>
          {state.companies.map((company) => (
            <div key={company.id} className="company-item">
              <strong>{company.name}</strong> - {company.location}
              <div className="company-actions">
                <button onClick={() => startEditCompany(company)}>Edit</button>
                <button onClick={() => deleteCompany(company.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="communication-method-management">
        <h2>Communication Method Management</h2>
        <button
          className="toggle-form-btn"
          onClick={() => setShowMethodForm(!showMethodForm)}
        >
          {showMethodForm ? "Hide Form" : "Add Communication Method"}
        </button>
        <form
          onSubmit={handleAddNewCommunicationMethod}
          className={`collapsible-form ${showMethodForm ? "open" : ""}`}
        >
          <label>
            Method Name:
            <input
              type="text"
              name="name"
              value={methodForm.name}
              onChange={handleMethodChange}
              placeholder="Enter Method Name"
              required
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={methodForm.description}
              onChange={handleMethodChange}
              placeholder="Enter Description"
            />
          </label>
          <label>
            Sequence Order:
            <input
              type="number"
              name="sequence"
              value={methodForm.sequence}
              onChange={handleMethodChange}
              placeholder="Enter Sequence Order"
              min="1"
            />
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              name="isMandatory"
              checked={methodForm.isMandatory}
              onChange={handleMethodChange}
            />
            Mandatory Method
          </label>
          <button type="submit" className="submit-btn">
            {editingMethod ? "Update Method" : "Add Method"}
          </button>
          {editingMethod && (
            <button
              type="button"
              onClick={() => setEditingMethod(false)}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
        </form>

        <div className="communication-methods-list">
          <h3>Existing Communication Methods</h3>
          {state.communicationMethods.map((method) => (
            <div key={method.id} className="method-item">
              <strong>{method.name}</strong> - {method.description} (Sequence:{" "}
              {method.sequence}, {method.isMandatory ? "Mandatory" : "Optional"})
              <div className="method-actions">
                <button onClick={() => startEditMethod(method)}>Edit</button>
                <button onClick={() => deleteCommunicationMethod(method.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminModule;
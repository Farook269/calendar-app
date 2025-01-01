import React, { useState } from "react";
import { useCommunication } from "../context/data";
import "./userDashboard.css";

function UserDashboard() {
  const {
    state,
    addCommunication,
    getLastFiveCommunications,
    getNextScheduledCommunication,
  } = useCommunication();

  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [communicationModal, setCommunicationModal] = useState(false);
  const [selectedCommunication, setSelectedCommunication] = useState(null);
  const [communicationForm, setCommunicationForm] = useState({
    type: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // Handle company selection
  const handleCompanySelect = (companyId) => {
    setSelectedCompanies((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
  };

  // Log a new communication
  const handleCommunicationLog = (e) => {
    e.preventDefault();
    selectedCompanies.forEach((companyId) => {
      addCommunication({
        ...communicationForm,
        companyId,
        timestamp: new Date(communicationForm.date),
      });
    });
    setCommunicationModal(false);
    setSelectedCompanies([]);
    setCommunicationForm({
      type: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
  };

  // Get company status for color-coded highlights
  const getCompanyStatus = (company) => {
    const today = new Date();
    const lastCom = new Date(company.lastCommunicationDate);
    const daysSinceLastCom = Math.floor(
      (today - lastCom) / (1000 * 60 * 60 * 24)
    );
    const commPeriod = company.communicationPeriodicity || 14;

    if (daysSinceLastCom > commPeriod) return "overdue";
    if (daysSinceLastCom === commPeriod) return "due-today";
    return "normal";
  };

  // Get overdue communications
  const getOverdueCommunications = () => {
    const today = new Date();
    return state.companies.filter((company) => {
      const lastCom = new Date(company.lastCommunicationDate);
      const commPeriod = company.communicationPeriodicity || 14;
      const dueDate = new Date(lastCom);
      dueDate.setDate(dueDate.getDate() + commPeriod);
      return dueDate < today;
    });
  };

  // Get due today communications
  const getDueTodayCommunications = () => {
    const today = new Date();
    return state.companies.filter((company) => {
      const lastCom = new Date(company.lastCommunicationDate);
      const commPeriod = company.communicationPeriodicity || 14;
      const dueDate = new Date(lastCom);
      dueDate.setDate(dueDate.getDate() + commPeriod);
      return dueDate.toDateString() === today.toDateString();
    });
  };

  // Get notifications count
  const getNotificationsCount = () => {
    const overdueCount = getOverdueCommunications().length;
    const dueTodayCount = getDueTodayCommunications().length;
    return overdueCount + dueTodayCount;
  };

  // Render tooltip for communication
  const renderCommunicationTooltip = (communication) => {
    return (
      <div className="communication-tooltip">
        <p>Type: {communication.type}</p>
        <p>Date: {new Date(communication.timestamp).toLocaleDateString()}</p>
        <p>Notes: {communication.notes || "No notes"}</p>
      </div>
    );
  };

  return (
    <div className="user-dashboard">
      <h1>Communication Dashboard</h1>

      {/* Notifications Section */}
      <section className="notifications">
        <h2>
          Notifications{" "}
          <span className="notification-badge">{getNotificationsCount()}</span>
        </h2>
        <div className="overdue-communications">
          <h3>Overdue Communications</h3>
          {getOverdueCommunications().map((company) => (
            <div key={company.id} className="notification-item overdue">
              {company.name} - Overdue by{" "}
              {Math.floor(
                (new Date() - new Date(company.lastCommunicationDate)) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              days
            </div>
          ))}
        </div>
        <div className="due-today-communications">
          <h3>Today's Communications</h3>
          {getDueTodayCommunications().map((company) => (
            <div key={company.id} className="notification-item due-today">
              {company.name} - Due Today
            </div>
          ))}
        </div>
      </section>

      {/* Companies Grid */}
      <section className="companies-grid">
        {state.companies.map((company) => {
          const lastFiveCommunications = getLastFiveCommunications(company.id);
          const nextScheduledCommunication = getNextScheduledCommunication(
            company.id
          );

          return (
            <div
              key={company.id}
              className={`company-row ${getCompanyStatus(company)}`}
            >
              <input
                type="checkbox"
                checked={selectedCompanies.includes(company.id)}
                onChange={() => handleCompanySelect(company.id)}
              />
              <h3>{company.name}</h3>

              <div className="last-communications">
                <h4>Recent Communications</h4>
                {lastFiveCommunications.map((comm) => (
                  <div
                    key={comm.id}
                    className="communication-item"
                    onMouseEnter={() => setSelectedCommunication(comm)}
                    onMouseLeave={() => setSelectedCommunication(null)}
                  >
                    {comm.type} -{" "}
                    {new Date(comm.timestamp).toLocaleDateString()}
                    {selectedCommunication === comm &&
                      renderCommunicationTooltip(comm)}
                  </div>
                ))}
              </div>

              <div className="next-communication">
                <h4>Next Scheduled Communication</h4>
                {nextScheduledCommunication ? (
                  <div>
                    {nextScheduledCommunication.type} -{" "}
                    {nextScheduledCommunication.date.toLocaleDateString()}
                  </div>
                ) : (
                  <div>No scheduled communication</div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Log Communication Button */}
      <button
        className="log-communication-btn"
        onClick={() => setCommunicationModal(true)}
        disabled={selectedCompanies.length === 0}
      >
        Log Communication
      </button>

      {/* Communication Modal */}
      {communicationModal && (
        <div className="communication-modal">
          <div className="modal-content">
            <h2>Log Communication</h2>
            <form onSubmit={handleCommunicationLog}>
              <select
                value={communicationForm.type}
                onChange={(e) =>
                  setCommunicationForm((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }))
                }
                required
              >
                <option value="">Select Communication Type</option>
                {state.communicationMethods.map((method) => (
                  <option key={method.id} value={method.name}>
                    {method.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={communicationForm.date}
                onChange={(e) =>
                  setCommunicationForm((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                required
              />
              <textarea
                placeholder="Communication Notes"
                value={communicationForm.notes}
                onChange={(e) =>
                  setCommunicationForm((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
              />
              <button type="submit">Log Communication</button>
              <button
                type="button"
                onClick={() => setCommunicationModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
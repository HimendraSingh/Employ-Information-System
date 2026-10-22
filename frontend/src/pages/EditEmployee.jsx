import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import EmployeeForm from "../components/EmployeeForm";
import { API_BASE_URL } from "../config";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      setIsFetching(true);
      setFetchError("");

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Could not find employee details");
        }

        const data = await response.json();
        setInitialData(data);
      } catch (error) {
        setFetchError(error.message || "Failed to load employee");
      } finally {
        setIsFetching(false);
      }
    };

    fetchEmployeeDetails();
  }, [id, navigate]);

  const handleUpdateEmployee = async (formData) => {
    setIsLoading(true);
    setServerError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.message || "Failed to update employee");
        return;
      }

      navigate("/dashboard");
    } catch (error) {
      setServerError("Could not connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="page-wrapper">
        <div className="state-card loading-state">
          <div className="spinner"></div>
          <p>Loading employee data...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="page-wrapper">
        <div className="state-card error-state">
          <p className="error-text">⚠️ {fetchError}</p>
          <Link to="/dashboard" className="btn-primary" style={{ display: "inline-block", width: "auto" }}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="form-card">
        <div className="form-header">
          <h2>Edit Employee Details</h2>
          <p>Update information for <strong>{initialData?.name}</strong>.</p>
        </div>

        <EmployeeForm
          initialValues={initialData}
          onSubmit={handleUpdateEmployee}
          isLoading={isLoading}
          serverError={serverError}
          isEditMode={true}
        />
      </div>
    </div>
  );
};

export default EditEmployee;

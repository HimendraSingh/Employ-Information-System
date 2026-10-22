import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../components/EmployeeForm";
import { API_BASE_URL } from "../config";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleAddEmployee = async (formData) => {
    setIsLoading(true);
    setServerError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.message || "Failed to create employee");
        return;
      }

      navigate("/dashboard");
    } catch (error) {
      setServerError("Could not connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="form-card">
        <div className="form-header">
          <h2>Add New Employee</h2>
          <p>Register a new worker or engineer in the IFFCO Phulpur database.</p>
        </div>

        <EmployeeForm
          onSubmit={handleAddEmployee}
          isLoading={isLoading}
          serverError={serverError}
          isEditMode={false}
        />
      </div>
    </div>
  );
};

export default AddEmployee;

import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { isAuthenticated } from "../auth/helper";
import { Link } from "react-router-dom";
import { updateCategory, getCategory } from "./helper/adminapicall";

const AddCategory = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    error: "",
  });

  const [success, setSuccess] = useState(false);

  const { name, error } = values;

  const preload = (categoryId) => {
    getCategory(categoryId).then((data) => {
      if (data?.error) {
        setValues({ ...values, error: data?.error });
      } else {
        setValues({
          ...values,
          name: data.name,
        });
      }
    });
  };

  useEffect(() => {
    preload(match.params.categoryId);
  }, []);

  const { user, token } = isAuthenticated();

  const backButton = () => {
    return (
      <div className="mt-5">
        <Link className="btn btn-sm btn-success mb-3" to="/admin/dashboard">
          Back to Dashboard
        </Link>
      </div>
    );
  };

  const handleChange = (event) => {
    setValues({ ...values, name: event.target.value, [error]: "" });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, [name]: event.target.value, [error]: "" });
    setSuccess(false);

    //Firing Backend Request
    updateCategory(match.params.categoryId, user._id, token, { name }).then(
      (data) => {
        if (data?.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({ ...values, name: "", error: "" });
          setSuccess(true);
        }
      }
    );
  };

  const successMessage = () => {
    if (success) {
      return <h4 className="text-success">Category updated successfully.</h4>;
    }
  };

  const errorMessage = () => {
    if (error) {
      return <h4 className="text-warning">Failed to update category.</h4>;
    }
  };

  const myCategoryForm = () => {
    return (
      <form>
        <div className="form-group">
          <p className="lead">Enter a category:</p>
          <input
            type="text"
            className="form-control my-3"
            onChange={handleChange}
            value={name}
            autoFocus
            required
            placeholder="Name"
          />
          <button onClick={onSubmit} className="btn btn-outline-info">
            Update Category
          </button>
        </div>
      </form>
    );
  };

  return (
    <Base
      title="Create a category from here."
      description="Add category for new T-Shirts"
      className="container bg-info p-4"
    >
      <div className="row bg-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()} {errorMessage()}
          {myCategoryForm()} {backButton()}
        </div>
      </div>
    </Base>
  );
};

export default AddCategory;

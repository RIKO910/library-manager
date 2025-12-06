import React, { useState } from 'react';

const AddBookForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        publication_year: '',
        status: 'available'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('Title is required');
            return;
        }

        const submitData = {
            ...formData,
            publication_year: formData.publication_year ? parseInt(formData.publication_year) : null
        };

        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="book-form">
            <table className="form-table">
                <tbody>
                <tr>
                    <th scope="row">
                        <label htmlFor="title">
                            Title <span className="required">*</span>
                        </label>
                    </th>
                    <td>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="regular-text"
                            required
                        />
                    </td>
                </tr>

                <tr>
                    <th scope="row">
                        <label htmlFor="author">Author</label>
                    </th>
                    <td>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            className="regular-text"
                        />
                    </td>
                </tr>

                <tr>
                    <th scope="row">
                        <label htmlFor="description">Description</label>
                    </th>
                    <td>
              <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className="large-text"
              />
                    </td>
                </tr>

                <tr>
                    <th scope="row">
                        <label htmlFor="publication_year">Publication Year</label>
                    </th>
                    <td>
                        <input
                            type="number"
                            id="publication_year"
                            name="publication_year"
                            value={formData.publication_year}
                            onChange={handleChange}
                            min="1000"
                            max={new Date().getFullYear() + 1}
                            className="small-text"
                        />
                    </td>
                </tr>

                <tr>
                    <th scope="row">
                        <label htmlFor="status">Status</label>
                    </th>
                    <td>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="available">Available</option>
                            <option value="borrowed">Borrowed</option>
                            <option value="unavailable">Unavailable</option>
                        </select>
                    </td>
                </tr>
                </tbody>
            </table>

            <p className="submit">
                <button type="submit" className="button button-primary">
                    Add Book
                </button>
                <button
                    type="button"
                    className="button"
                    onClick={onCancel}
                    style={{ marginLeft: '10px' }}
                >
                    Cancel
                </button>
            </p>
        </form>
    );
};

export default AddBookForm;
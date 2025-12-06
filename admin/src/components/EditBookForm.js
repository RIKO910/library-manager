import React, { useState, useEffect } from 'react';

const EditBookForm = ({ book, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        publication_year: '',
        status: 'available'
    });

    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title || '',
                author: book.author || '',
                description: book.description || '',
                publication_year: book.publication_year || '',
                status: book.status || 'available'
            });
        }
    }, [book]);

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

        onSubmit(book.id, submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="book-form">
            <table className="form-table">
                <tbody>
                <tr>
                    <th scope="row">
                        <label htmlFor="edit-title">
                            Title <span className="required">*</span>
                        </label>
                    </th>
                    <td>
                        <input
                            type="text"
                            id="edit-title"
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
                        <label htmlFor="edit-author">Author</label>
                    </th>
                    <td>
                        <input
                            type="text"
                            id="edit-author"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            className="regular-text"
                        />
                    </td>
                </tr>

                <tr>
                    <th scope="row">
                        <label htmlFor="edit-description">Description</label>
                    </th>
                    <td>
              <textarea
                  id="edit-description"
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
                        <label htmlFor="edit-publication_year">Publication Year</label>
                    </th>
                    <td>
                        <input
                            type="number"
                            id="edit-publication_year"
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
                        <label htmlFor="edit-status">Status</label>
                    </th>
                    <td>
                        <select
                            id="edit-status"
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
                    Update Book
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

export default EditBookForm;
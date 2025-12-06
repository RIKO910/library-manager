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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                    <label htmlFor="edit-title" className="wp-label">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="edit-title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="wp-input"
                        required
                        placeholder="Enter book title"
                    />
                </div>

                {/* Author */}
                <div>
                    <label htmlFor="edit-author" className="wp-label">
                        Author
                    </label>
                    <input
                        type="text"
                        id="edit-author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        className="wp-input"
                        placeholder="Enter author name"
                    />
                </div>
            </div>

            {/* Description */}
            <div>
                <label htmlFor="edit-description" className="wp-label">
                    Description
                </label>
                <textarea
                    id="edit-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="wp-textarea"
                    placeholder="Enter book description"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Publication Year */}
                <div>
                    <label htmlFor="edit-publication_year" className="wp-label">
                        Publication Year
                    </label>
                    <input
                        type="number"
                        id="edit-publication_year"
                        name="publication_year"
                        value={formData.publication_year}
                        onChange={handleChange}
                        min="1000"
                        max={new Date().getFullYear() + 1}
                        className="wp-input"
                        placeholder="e.g., 2023"
                    />
                </div>

                {/* Status */}
                <div>
                    <label htmlFor="edit-status" className="wp-label">
                        Status
                    </label>
                    <select
                        id="edit-status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="wp-select"
                    >
                        <option value="available">Available</option>
                        <option value="borrowed">Borrowed</option>
                        <option value="unavailable">Unavailable</option>
                    </select>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="wp-button wp-button-success"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Update Book
                </button>
            </div>
        </form>
    );
};

export default EditBookForm;
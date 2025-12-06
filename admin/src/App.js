import React, { useState, useEffect } from 'react';
import BookList from './components/BookList';
import AddBookForm from './components/AddBookForm';
import EditBookForm from './components/EditBookForm';
import './tailwind.css';

const App = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingBook, setEditingBook] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const API_URL = window.libraryManager.restUrl;
    const NONCE = window.libraryManager.nonce;

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/books`, {
                headers: {
                    'X-WP-Nonce': NONCE
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }

            const data = await response.json();
            setBooks(data.books || []);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching books:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleAddBook = async (bookData) => {
        try {
            const response = await fetch(`${API_URL}/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': NONCE
                },
                body: JSON.stringify(bookData)
            });

            if (!response.ok) {
                throw new Error('Failed to add book');
            }

            await fetchBooks();
            setShowAddForm(false);
            setSuccessMessage('Book added successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError('Error adding book: ' + err.message);
            setTimeout(() => setError(null), 3000);
            console.error('Error adding book:', err);
        }
    };

    const handleUpdateBook = async (id, bookData) => {
        try {
            const response = await fetch(`${API_URL}/books/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': NONCE
                },
                body: JSON.stringify(bookData)
            });

            if (!response.ok) {
                throw new Error('Failed to update book');
            }

            await fetchBooks();
            setEditingBook(null);
            setSuccessMessage('Book updated successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError('Error updating book: ' + err.message);
            setTimeout(() => setError(null), 3000);
            console.error('Error updating book:', err);
        }
    };

    const handleDeleteBook = async (id) => {
        if (!confirm('Are you sure you want to delete this book?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/books/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-WP-Nonce': NONCE
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete book');
            }

            await fetchBooks();
            setSuccessMessage('Book deleted successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError('Error deleting book: ' + err.message);
            setTimeout(() => setError(null), 3000);
            console.error('Error deleting book:', err);
        }
    };

    const handleEdit = (book) => {
        setEditingBook(book);
        setShowAddForm(false);
    };

    const handleCancelEdit = () => {
        setEditingBook(null);
    };

    const handleShowAddForm = () => {
        setShowAddForm(true);
        setEditingBook(null);
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Library Book Management</h1>
                        {!showAddForm && !editingBook && (
                            <button
                                onClick={handleShowAddForm}
                                className="wp-button wp-button-primary"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add New Book
                            </button>
                        )}
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="wp-notice wp-notice-error mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {successMessage && (
                        <div className="wp-notice wp-notice-success mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium">{successMessage}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Add Book Form */}
                {showAddForm && (
                    <div className="wp-card mb-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">Add New Book</h2>
                            <p className="text-gray-600 mt-1">Fill in the details to add a new book to the library</p>
                        </div>
                        <AddBookForm onSubmit={handleAddBook} onCancel={handleCancelAdd} />
                    </div>
                )}

                {/* Edit Book Form */}
                {editingBook && (
                    <div className="wp-card mb-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">Edit Book</h2>
                            <p className="text-gray-600 mt-1">Update the book information</p>
                        </div>
                        <EditBookForm
                            book={editingBook}
                            onSubmit={handleUpdateBook}
                            onCancel={handleCancelEdit}
                        />
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-wp-blue"></div>
                        <p className="mt-4 text-gray-600">Loading books...</p>
                    </div>
                ) : (
                    <BookList
                        books={books}
                        onEdit={handleEdit}
                        onDelete={handleDeleteBook}
                    />
                )}
            </div>
        </div>
    );
};

export default App;
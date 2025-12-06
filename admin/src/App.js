import React, { useState, useEffect } from 'react';
import BookList from './components/BookList';
import AddBookForm from './components/AddBookForm';
import EditBookForm from './components/EditBookForm';
import './App.css';

const App = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingBook, setEditingBook] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [error, setError] = useState(null);

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
            alert('Book added successfully!');
        } catch (err) {
            alert('Error adding book: ' + err.message);
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
            alert('Book updated successfully!');
        } catch (err) {
            alert('Error updating book: ' + err.message);
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
            alert('Book deleted successfully!');
        } catch (err) {
            alert('Error deleting book: ' + err.message);
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
        <div className="library-manager-app">
            <div className="header">
                <h2>Book Management</h2>
                {!showAddForm && !editingBook && (
                    <button className="button button-primary" onClick={handleShowAddForm}>
                        Add New Book
                    </button>
                )}
            </div>

            {error && (
                <div className="notice notice-error">
                    <p>Error: {error}</p>
                </div>
            )}

            {showAddForm && (
                <div className="form-section">
                    <h3>Add New Book</h3>
                    <AddBookForm onSubmit={handleAddBook} onCancel={handleCancelAdd} />
                </div>
            )}

            {editingBook && (
                <div className="form-section">
                    <h3>Edit Book</h3>
                    <EditBookForm
                        book={editingBook}
                        onSubmit={handleUpdateBook}
                        onCancel={handleCancelEdit}
                    />
                </div>
            )}

            {loading ? (
                <p>Loading books...</p>
            ) : (
                <BookList
                    books={books}
                    onEdit={handleEdit}
                    onDelete={handleDeleteBook}
                />
            )}
        </div>
    );
};

export default App;
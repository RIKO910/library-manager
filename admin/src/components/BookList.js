import React from 'react';

const BookList = ({ books, onEdit, onDelete }) => {
    if (books.length === 0) {
        return <p className="no-books">No books found. Add your first book!</p>;
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'available':
                return '#28a745';
            case 'borrowed':
                return '#ffc107';
            case 'unavailable':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    };

    return (
        <div className="book-list">
            <table className="wp-list-table widefat fixed striped">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Year</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {books.map((book) => (
                    <tr key={book.id}>
                        <td>{book.id}</td>
                        <td>
                            <strong>{book.title}</strong>
                            {book.description && (
                                <div className="book-description">
                                    {book.description.substring(0, 100)}
                                    {book.description.length > 100 ? '...' : ''}
                                </div>
                            )}
                        </td>
                        <td>{book.author || '-'}</td>
                        <td>{book.publication_year || '-'}</td>
                        <td>
                <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(book.status) }}
                >
                  {book.status}
                </span>
                        </td>
                        <td className="actions">
                            <button
                                className="button button-small"
                                onClick={() => onEdit(book)}
                            >
                                Edit
                            </button>
                            <button
                                className="button button-small button-link-delete"
                                onClick={() => onDelete(book.id)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookList;
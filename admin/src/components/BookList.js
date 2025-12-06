import React from 'react';

const BookList = ({ books, onEdit, onDelete }) => {
    if (books.length === 0) {
        return (
            <div className="wp-card">
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No books found</h3>
                    <p className="mt-1 text-gray-500">Get started by adding your first book.</p>
                </div>
            </div>
        );
    }

    const getStatusStyles = (status) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'borrowed':
                return 'bg-yellow-100 text-yellow-800';
            case 'unavailable':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="wp-card">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Book Collection</h2>
                <p className="text-sm text-gray-600">
                    Total {books.length} book{books.length !== 1 ? 's' : ''}
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="wp-table wp-table-striped">
                    <thead>
                    <tr>
                        <th className="w-16">ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th className="w-24">Year</th>
                        <th className="w-32">Status</th>
                        <th className="w-48">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {books.map((book) => (
                        <tr key={book.id}>
                            <td className="font-medium text-gray-500">#{book.id}</td>
                            <td>
                                <div className="font-medium text-gray-900">{book.title}</div>
                                {book.description && (
                                    <div className="mt-1 text-sm text-gray-500 truncate max-w-xs">
                                        {book.description}
                                    </div>
                                )}
                            </td>
                            <td>
                                {book.author || (
                                    <span className="text-gray-400 italic">Unknown</span>
                                )}
                            </td>
                            <td>
                                {book.publication_year || '-'}
                            </td>
                            <td>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(book.status)}`}>
                                        {book.status}
                                    </span>
                            </td>
                            <td>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onEdit(book)}
                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wp-blue"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(book.id)}
                                        className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookList;
import React, { useState } from 'react';

const SearchBar = ({ onSearch, onClear, initialValues = {} }) => {
    const [searchParams, setSearchParams] = useState({
        search: initialValues.search || '',
        status: initialValues.status || '',
        author: initialValues.author || '',
        year: initialValues.year || ''
    });

    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchParams);
    };

    const handleClear = () => {
        setSearchParams({
            search: '',
            status: '',
            author: '',
            year: ''
        });
        setShowAdvanced(false);
        onClear();
    };

    const hasActiveFilters = Object.values(searchParams).some(val => val !== '');

    return (
        <div className="wp-card mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Main Search */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label htmlFor="search" className="sr-only">Search books</label>
                        <div className="relative rounded-md shadow-sm">
                            <input
                                type="text"
                                id="search"
                                name="search"
                                value={searchParams.search}
                                onChange={handleChange}
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Search by title, author, or description..."
                                style={{ padding: "5px" }}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="wp-button wp-button-primary"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {showAdvanced ? 'Hide Filters' : 'Advanced Filters'}
                        </button>
                    </div>
                </div>

                {/* Advanced Filters */}
                {showAdvanced && (
                    <div className="border-t border-gray-200 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Author Filter */}
                            <div>
                                <label htmlFor="author" className="wp-label">
                                    Author
                                </label>
                                <input
                                    type="text"
                                    id="author"
                                    name="author"
                                    value={searchParams.author}
                                    onChange={handleChange}
                                    className="wp-input"
                                    placeholder="Filter by author"
                                />
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label htmlFor="status" className="wp-label">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={searchParams.status}
                                    onChange={handleChange}
                                    className="wp-select"
                                >
                                    <option value="">All Status</option>
                                    <option value="available">Available</option>
                                    <option value="borrowed">Borrowed</option>
                                    <option value="unavailable">Unavailable</option>
                                </select>
                            </div>

                            {/* Year Filter */}
                            <div>
                                <label htmlFor="year" className="wp-label">
                                    Publication Year
                                </label>
                                <input
                                    type="number"
                                    id="year"
                                    name="year"
                                    value={searchParams.year}
                                    onChange={handleChange}
                                    min="1000"
                                    max={new Date().getFullYear() + 1}
                                    className="wp-input"
                                    placeholder="e.g., 2023"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Active Filters */}
                {hasActiveFilters && (
                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                                {searchParams.search && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Search: {searchParams.search}
                                        <button
                                            type="button"
                                            onClick={() => setSearchParams(prev => ({ ...prev, search: '' }))}
                                            className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-600 hover:bg-blue-200"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {searchParams.author && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Author: {searchParams.author}
                                        <button
                                            type="button"
                                            onClick={() => setSearchParams(prev => ({ ...prev, author: '' }))}
                                            className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-600 hover:bg-green-200"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {searchParams.status && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Status: {searchParams.status}
                                        <button
                                            type="button"
                                            onClick={() => setSearchParams(prev => ({ ...prev, status: '' }))}
                                            className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-yellow-600 hover:bg-yellow-200"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {searchParams.year && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        Year: {searchParams.year}
                                        <button
                                            type="button"
                                            onClick={() => setSearchParams(prev => ({ ...prev, year: '' }))}
                                            className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-600 hover:bg-purple-200"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={handleClear}
                                className="text-sm font-medium text-red-600 hover:text-red-500"
                            >
                                Clear all
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default SearchBar;
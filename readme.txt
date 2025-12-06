=== Library Manager ===
Contributors: riko910
Tags: library, books, management
Requires at least: 5.8
Tested up to: 6.5
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A WordPress plugin to manage a library of books with a custom admin interface built in React.

== Description ==

Library Manager is a WordPress plugin that provides a complete book management system. It includes a custom database table, REST API endpoints, and a React-based admin interface for managing your library collection.

Features:
* Add, edit, delete, and view books
* Filter books by status, author, or publication year
* REST API for integration with external applications
* Custom admin interface built with React
* Pagination support

== Installation ==

= Install from ZIP =

1. Download the plugin ZIP file
2. Go to WordPress Admin → Plugins → Add New
3. Click "Upload Plugin"
4. Choose the ZIP file and click "Install Now"
5. Activate the plugin

== Database Schema ==

The plugin creates a custom table: `{$wpdb->prefix}lima_library_books`

```sql
CREATE TABLE wp_lima_library_books (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
title VARCHAR(255) NOT NULL,
description LONGTEXT,
author VARCHAR(255),
publication_year INT,
status ENUM('available','borrowed','unavailable') DEFAULT 'available',
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (id)
);


== REST API Documentation ==

Base URL: /wp-json/library/v1

= GET /books =

Get all books with optional filters.

Example:

curl http://yoursite.com/wp-json/library/v1/books
curl http://yoursite.com/wp-json/library/v1/books?status=available&author=Tolkien

Response:

{
  "books": [
    {
      "id": "1",
      "title": "The Lord of the Rings",
      "description": "Epic fantasy novel",
      "author": "J.R.R. Tolkien",
      "publication_year": "1954",
      "status": "available",
      "created_at": "2024-01-01 12:00:00",
      "updated_at": "2024-01-01 12:00:00"
    }
  ],
  "total": 1,
  "page": 1,
  "per_page": 10
}

= GET /books/{id} =

Get a single book by ID.

Example:

curl http://yoursite.com/wp-json/library/v1/books/1

Response:

{
  "id": "1",
  "title": "The Lord of the Rings",
  "description": "Epic fantasy novel",
  "author": "J.R.R. Tolkien",
  "publication_year": "1954",
  "status": "available",
  "created_at": "2024-01-01 12:00:00",
  "updated_at": "2024-01-01 12:00:00"
}

= POST /books =

Create a new book.

Permission: Requires edit_posts capability

Headers:

Content-Type: application/json

X-WP-Nonce: {your-nonce}

Body:

{
  "title": "The Hobbit",
  "description": "Fantasy novel",
  "author": "J.R.R. Tolkien",
  "publication_year": 1937,
  "status": "available"
}


= PUT /books/{id} =

Update an existing book.

Permission: Requires edit_posts capability

Headers:

Content-Type: application/json

X-WP-Nonce: {your-nonce}

Body: (all fields optional)

{
  "title": "The Hobbit - Updated",
  "status": "borrowed"
}

= DELETE /books/{id} =

Delete a book.

Permission: Requires edit_posts capability

Headers:

X-WP-Nonce: {your-nonce}

Example:

curl -X DELETE http://yoursite.com/wp-json/library/v1/books/2 \
  -H "X-WP-Nonce: your-nonce-here"

Response: 200 OK

{
  "message": "Book deleted successfully"
}

== Building the React App ==

The React admin interface needs to be built before the plugin can work properly.

1. Navigate to the plugin's admin directory:

cd wp-content/plugins/library-manager/admin

2. Install dependencies:

npm install

3. Build for production:

npm run build

4. OR for development with auto-rebuild:

npm run dev

This will create a `bundle.js` file in the `admin/dist/` directory.

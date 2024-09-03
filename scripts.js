function toggleSearchOptions() {
    const category = document.getElementById('search-category').value;
    const genreOptions = document.getElementById('genre-options');
    const searchInput = document.getElementById('search-input');

    if (category === 'genre') {
        genreOptions.style.display = 'block';
        searchInput.style.display = 'none'; // Hide search input for genres
    } else {
        genreOptions.style.display = 'none';
        searchInput.style.display = 'block'; // Show search input for other categories
        if (category === 'author') {
            searchInput.placeholder = "Search by Author Name";
        } else {
            searchInput.placeholder = "Search by Book Name";
        }
    }
}

function search() {
    const category = document.getElementById('search-category').value;
    const query = document.getElementById('search-input').value.trim();
    const genre = document.getElementById('genre-select') ? document.getElementById('genre-select').value : '';

    if (category === 'book-name' && query) {
        searchByBookName(query);
    } else if (category === 'genre' && genre) {
        searchByGenre(genre);
    } else if (category === 'author' && query) {
        searchByAuthor(query);
    } else {
        alert('Please enter a book name, select a genre, or enter an author\'s name.');
    }
}

function searchByBookName(bookName) {
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(bookName)}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            displayBooks(data.docs);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function searchByGenre(genre) {
    const url = `https://openlibrary.org/subjects/${genre}.json`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            displayBooks(data.works);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function searchByAuthor(author) {
    const url = `https://openlibrary.org/search.json?author=${encodeURIComponent(author)}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            displayBooks(data.docs);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Function to fetch and log book description
function fetchBookDetails(workKey) {
    const url = `https://openlibrary.org/works/${workKey}.json`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const title = data.title || 'No title available';
            const description = data.description || 'No description available';
            const subjects = data.subjects ? data.subjects.join(', ') : 'No subjects available';
            const authors = data.authors.map(author => author.author.key).join(', ') || 'No authors available';
            const publicationDate = data.first_publish_date || 'No publication date available';
            const coverImages = data.covers || [];
            const subjectPeople = data.subject_people ? data.subject_people.join(', ') : 'No subject people available';
            const subjectPlaces = data.subject_places ? data.subject_places.join(', ') : 'No subject places available';
            const subjectTimes = data.subject_times ? data.subject_times.join(', ') : 'No subject times available';
            const excerpts = data.excerpts ? data.excerpts.map(excerpt => `${excerpt.excerpt} (Comment: ${excerpt.comment})`).join('<br>') : 'No excerpts available';

            // Generate HTML content
            const container = document.getElementById('book-container');
            container.innerHTML = `
                <div class="book-details-container">
                    <h1>${title}</h1>
                    <div class="book-cover-images">
                        ${coverImages.map(id => `<img src="https://covers.openlibrary.org/b/id/${id}-L.jpg" alt="${title} cover">`).join('')}
                    </div>
                    <p><strong>Description:</strong> ${description}</p>
                    <p><strong>Subjects:</strong> ${subjects}</p>
                    <p><strong>Authors:</strong> ${authors}</p>
                    <p><strong>Publication Date:</strong> ${publicationDate}</p>
                    <p><strong>Subject People:</strong> ${subjectPeople}</p>
                    <p><strong>Subject Places:</strong> ${subjectPlaces}</p>
                    <p><strong>Subject Times:</strong> ${subjectTimes}</p>
                    <p><strong>Excerpts:</strong> ${excerpts}</p>
                    <button id="close-details">Close</button>
                </div>
            `;

            // Add event listener for close button
            document.getElementById('close-details').addEventListener('click', () => {
                container.innerHTML = ''; // Clear the book details
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}



function displayBooks(books) {
    console.log('Received books data:', books);

    let container = document.getElementById('book-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'book-container';
        document.querySelector('main').appendChild(container);
    }
    
    container.innerHTML = '';

    if (books && Array.isArray(books) && books.length > 0) {
        books.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.className = 'book';
            bookDiv.style.cursor = 'pointer';

            const bookKey = book.key ? book.key.split('/').pop() : null;
            console.log(bookKey);

            bookDiv.addEventListener('click', () => {
                alert(`You clicked on the book: ${book.title}`);
                if (bookKey) {
                    fetchBookDetails(bookKey); // Fetch and log book description
                }
            });

            const title = document.createElement('h2');
            title.textContent = book.title || 'No title available';
            title.style.fontWeight = 'bold';
            title.style.fontSize = '12px';

            const publishYear = document.createElement('p');
            publishYear.innerHTML = `<strong>Published Year:</strong> ${book.first_publish_year || 'Unknown'}`;
            publishYear.style.fontWeight = 'bold';
            publishYear.style.fontSize = '12px';

            const authors = document.createElement('p');
            authors.innerHTML = `<strong>Authors:</strong> ${book.author_name ? book.author_name.join(', ') : (book.authors ? book.authors.map(author => author.name).join(', ') : 'Unknown')}`;
            authors.style.fontWeight = 'bold';
            authors.style.fontSize = '12px';

            const printDisabled = document.createElement('p');
            printDisabled.innerHTML = `<strong>Print Disabled:</strong> ${book.printdisabled ? 'Yes' : 'No'}`;
            printDisabled.style.fontSize = '12px';

            const publicScan = document.createElement('p');
            publicScan.innerHTML = `<strong>Public Scan:</strong> ${book.public_scan ? 'Yes' : 'No'}`;
            publicScan.style.fontSize = '12px';

            // Add description
            const description = document.createElement('p');
            description.innerHTML = `<strong>Description:</strong> ${book.description || 'No description available'}`;
            description.style.fontSize = '12px';

            let coverImageUrl = '';

            if (book.cover_id) {
                coverImageUrl = `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`;
            } else if (book.cover_edition_key) {
                coverImageUrl = `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`;
            } else if (book.isbn && Array.isArray(book.isbn) && book.isbn.length > 0) {
                coverImageUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg`;
            }

            const img = document.createElement('img');
            img.alt = `Cover for ${book.title}`;
            img.style.width = '100%';
            img.style.height = '120px';

            if (coverImageUrl) {
                img.src = coverImageUrl;
            } else {
                img.alt += ' (No cover available)';
                img.src = 'https://via.placeholder.com/120x180.png?text=No+Cover+Available';
            }

            bookDiv.appendChild(img);
            bookDiv.appendChild(title);
            bookDiv.appendChild(publishYear);
            bookDiv.appendChild(authors);
            bookDiv.appendChild(printDisabled);
            bookDiv.appendChild(publicScan);
            bookDiv.appendChild(description); // Add description to the bookDiv

            container.appendChild(bookDiv);
        });
    } else {
        const noWorks = document.createElement('p');
        noWorks.textContent = 'No works found';
        container.appendChild(noWorks);
    }
}



// contact form

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Save message to local storage
    const storedMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    storedMessages.push({ name, email, subject, message, timestamp: new Date().toISOString() });
    localStorage.setItem('contactMessages', JSON.stringify(storedMessages));

    // Simulate message sending
    alert('Your message has been sent!');

    // Clear the form
    event.target.reset();
});






document.getElementById('signinBtn').addEventListener('click', function() {
    document.getElementById('form-title').textContent = 'Sign In';
    document.getElementById('signupBtn').textContent = 'Login';
    document.getElementById('nameField').style.display = 'none';
    document.getElementById('formMessage').textContent = '';
});

document.getElementById('signupBtn').addEventListener('click', function(e) {
    const isSignupMode = document.getElementById('signupBtn').textContent === 'Sign Up';
    if (isSignupMode) {
        handleSignup();
    } else {
        handleLogin();
    }
});

// Handle Signup
function handleSignup() {
    const name = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!name || !email || !password) {
        document.getElementById('formMessage').textContent = "Please fill in all fields.";
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.email === email);

    if (userExists) {
        document.getElementById('formMessage').textContent = "User already exists!";
    } else {
        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        document.getElementById('formMessage').textContent = "Signup successful!";
        document.getElementById('userForm').reset();
    }
}

// Handle Login
// Handle Login
function handleLogin() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        document.getElementById('formMessage').textContent = "Please fill in all fields.";
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const validUser = users.find(user => user.email === email && user.password === password);

    if (validUser) {
        document.getElementById('formMessage').textContent = "Login successful!";
        localStorage.setItem('loggedInUser', JSON.stringify(validUser));
        // Redirect to main page
        window.location.href = "main.html";
    } else {
        document.getElementById('formMessage').textContent = "Invalid email or password!";
    }
}

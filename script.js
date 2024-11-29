// Form Toggle Functionality
const formContainer = document.getElementById('form-container');
const switchToLogin = document.getElementById('switch-to-login');
const switchToSignup = document.getElementById('switch-to-signup');

// Switch to Login Form
switchToLogin.addEventListener('click', function() {
    formContainer.classList.add('login-active');
    clearFields('signup-form'); // Clear signup form when switching
});

// Switch to Signup Form
switchToSignup.addEventListener('click', function() {
    formContainer.classList.remove('login-active');
    clearFields('login-form'); // Clear login form when switching
});

// Temporary storage for user credentials
let registeredUser = {};

// Validation Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Function to clear all input fields in a form
function clearFields(formId) {
    const form = document.getElementById(formId);
    form.reset(); // Clears all form inputs
    document.querySelectorAll('.error').forEach((el) => (el.textContent = '')); // Clears all error messages
}

function validatePassword(password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
        password.length >= 6 &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar
    );
}

// Calculate Age Based on DOB
function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    // Adjust age if the current month/day is before the birth month/day
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
    }

    return age;
}

// Attach event listener to DOB input to auto-calculate age
document.getElementById('dob').addEventListener('change', function () {
    const dob = this.value;
    const ageInput = document.getElementById('age');
    const age = calculateAge(dob);

    if (!isNaN(age) && age >= 0) {
        ageInput.value = age; // Set calculated age
    } else {
        ageInput.value = ''; // Clear age if invalid DOB
    }
});

// Signup Form Submission
document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Reset previous error messages
    document.querySelectorAll('.error').forEach((el) => (el.textContent = ''));

    // Collect form data
    const formData = {
        fullname: document.getElementById('fullname').value,
        email: document.getElementById('signup-email').value,
        password: document.getElementById('signup-password').value,
        confirmPassword: document.getElementById('confirm-password').value,
        gender: document.querySelector('input[name="gender"]:checked')?.value,
        dob: document.getElementById('dob').value,
        age: parseInt(document.getElementById('age').value, 10), // Convert age to integer
        country: document.getElementById('country').value,
        interests: Array.from(
            document.querySelectorAll('input[name="interests"]:checked')
        ).map((el) => el.value),
    };

    let isValid = true;

    // Validation checks
    if (formData.fullname.trim().split(' ').length < 2) {
        document.getElementById('fullname-error').textContent =
            'Please enter full name';
        isValid = false;
    }

    if (!validateEmail(formData.email)) {
        document.getElementById('signup-email-error').textContent =
            'Invalid email address';
        isValid = false;
    }

    if (!validatePassword(formData.password)) {
        document.getElementById('signup-password-error').textContent =
            'Password must be 6+ chars with uppercase, lowercase, number, special char';
        isValid = false;
    }

    if (!formData.dob || isNaN(formData.age) || formData.age < 18) {
        document.getElementById('dob-error').textContent =
            'You must be at least 18 years old';
        isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
        document.getElementById('confirm-password-error').textContent =
            'Passwords do not match';
        isValid = false;
    }

    if (isValid) {

         // Store user credentials in temporary storage
         registeredUser.email = formData.email;
         registeredUser.password = formData.password;

        console.log('User Registration Data:', formData);
        alert('Signup Successful! You can now login.');

        // Clear fields after signup
        clearFields('signup-form');

        // Switch to login form
        formContainer.classList.add('login-active');
    }
});

// Login Form Submission
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Reset previous error messages
    document.querySelectorAll('.error').forEach((el) => (el.textContent = ''));

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    let isValid = true;

    // Email validation
    if (!validateEmail(email)) {
        document.getElementById('login-email-error').textContent =
            'Invalid email address';
        isValid = false;
    }

    // Password validation (basic check)
    if (password.length < 6) {
        document.getElementById('login-password-error').textContent =
            'Invalid password';
        isValid = false;
    }

    // Validate against registered user credentials
    if (email !== registeredUser.email || password !== registeredUser.password) {
        document.getElementById('login-password-error').textContent =
            'Incorrect email or password';
        isValid = false;
    }

    if (isValid) {
        alert('Login Successful!');
        clearFields('login-form');
    }
});

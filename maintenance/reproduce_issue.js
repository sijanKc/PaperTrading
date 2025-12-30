
const API_URL = 'http://localhost:5000/api';

async function run() {
    const timestamp = Date.now();
    const userData = {
        fullName: 'Test User',
        dob: '1990-01-01',
        gender: 'Male',
        nationality: 'Nepali',
        citizenNo: `123-${timestamp}`,
        countryCode: '+977',
        mobile: `98${timestamp.toString().slice(-8)}`,
        email: `test_${timestamp}@example.com`,
        address: 'Kathmandu',
        bankName: 'NABIL',
        branch: 'Kantipath',
        accountNumber: `001${timestamp}`,
        accountType: 'Savings',
        username: `testuser_${timestamp}`,
        password: 'password123',
        confirmPassword: 'password123',
        confirmInfo: true,
        confirmPaperTrading: true
    };

    console.log('1. Registering user...');
    try {
        const regRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const regData = await regRes.json();
        console.log('Register response:', regRes.status, regData);

        if (!regData.success && !regData.token) {
            console.log('Registration failed');
            return;
        }
    } catch (e) {
        console.error('Registration error:', e.message);
        return;
    }

    console.log('2. Logging in...');
    let token;
    try {
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: userData.email, password: userData.password })
        });
        const loginData = await loginRes.json();
        console.log('Login response:', loginRes.status, loginData);

        if (loginData.success || loginData.token) {
            token = loginData.token;
        } else {
            console.error('Login failed');
            return;
        }
    } catch (e) {
        console.error('Login error:', e.message);
        return;
    }

    console.log('3. Buying stock (NABIL)...');
    try {
        const buyRes = await fetch(`${API_URL}/trade/buy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                symbol: 'NABIL',
                quantity: 10
            })
        });
        const buyData = await buyRes.json();
        console.log('Buy response:', buyRes.status, buyData);
    } catch (e) {
        console.error('Buy error:', e.message);
    }
}

run();

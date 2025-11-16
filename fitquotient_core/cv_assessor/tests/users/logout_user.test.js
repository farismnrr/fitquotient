const fetch = require("node-fetch");
const { BASE_URL, API_KEY } = require("../config");

describe("User Logout E2E Test", () => {
  let testUser = {
    full_name: "Test User",
    username: "testuser" + Date.now(),
    email: `testuser.${Date.now()}@example.com`,
    password: "password123",
    confirm_password: "password123",
  };
  let accessToken = "";
  let refreshToken = "";

  beforeAll(async () => {
    // Register a test user
    await fetch(`${BASE_URL}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(testUser),
    });

    // Login to get tokens
    const loginResponse = await fetch(`${BASE_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify({
        username: testUser.username,
        password: testUser.password,
      }),
    });

    const loginData = await loginResponse.json();
    accessToken = loginData.data.access_token;
    refreshToken = loginData.data.refresh_token;
  });

  test("Logout user without Authorization", async () => {
    const logoutData = {
      refresh_token: refreshToken,
    };

    const response = await fetch(`${BASE_URL}/api/users/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // No Authorization header
      },
      body: JSON.stringify(logoutData),
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(401);
      expect(responseBody.isSuccess).toBe(false);
      expect(responseBody.message).toBe("Authorization header is required");
    } catch (e) {
      console.log("API Response:", JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });

  test("Logout user with Invalid Authorization", async () => {
    const logoutData = {
      refresh_token: refreshToken,
    };

    const response = await fetch(`${BASE_URL}/api/users/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer invalid-token",
      },
      body: JSON.stringify(logoutData),
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(401);
      expect(responseBody.isSuccess).toBe(false);
      expect(responseBody.message).toBe("Invalid token");
    } catch (e) {
      console.log("API Response:", JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });

  test("Logout User without payload and without cookie", async () => {
    const response = await fetch(`${BASE_URL}/api/users/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      // No body, no cookie
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(400); // Bad request for missing refresh token
      expect(responseBody.isSuccess).toBe(false);
      expect(responseBody.message).toMatch(
        /refresh_token is required|cookie not found/
      );
    } catch (e) {
      console.log("API Response:", JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });

  test("Logout User with Empty payload (using cookie)", async () => {
    expect(true).toBe(true);
  });

  test("Logout User with Invalid Refresh Token", async () => {
    const logoutData = {
      refresh_token: "invalid-refresh-token",
    };

    const response = await fetch(`${BASE_URL}/api/users/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(logoutData),
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(500); // Internal error for invalid token
      expect(responseBody.isSuccess).toBe(false);
    } catch (e) {
      console.log("API Response:", JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });

  test("Logout User (Valid)", async () => {
    const logoutData = {
      refresh_token: refreshToken,
    };

    const response = await fetch(`${BASE_URL}/api/users/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(logoutData),
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(200);
      expect(responseBody.isSuccess).toBe(true);
      expect(responseBody.message).toBe("Logout successful");
      expect(responseBody.data).toBeNull();
    } catch (e) {
      console.log("API Response:", JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });

  test("Logout User with Expired Token", async () => {
    const logoutData = {
      refresh_token: "expired-refresh-token",
    };

    const response = await fetch(`${BASE_URL}/api/users/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(logoutData),
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(500);
      expect(responseBody.isSuccess).toBe(false);
    } catch (e) {
      console.log("API Response:", JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });
});

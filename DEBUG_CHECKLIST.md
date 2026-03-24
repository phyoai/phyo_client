# Login Redirect Issue - Debug Checklist

## Steps to Debug

### 1. **Stop & Restart Both Servers**
```bash
# Terminal 1: Backend
cd "c:/full stack phyo/phyo_server"
npm run dev

# Terminal 2: Frontend
cd "c:/full stack phyo/phyo_client"
npm run dev
```

### 2. **Open Browser DevTools**
- Press `F12` to open DevTools
- Go to **Console** tab
- Go to **Application** tab (to view localStorage/cookies)

### 3. **Before Login - Clear Everything**
Run in browser console:
```javascript
localStorage.clear();
document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
console.log('✅ Cleared all storage');
```

### 4. **Attempt Login**
- Visit http://localhost:3000/login
- Enter valid credentials
- Click "Login"

### 5. **Check Console Output**
Look for these debug messages (in this order):
```
1. "Submitting login form"
2. "Full API Response: { message: ..., token: ..., user: { ... } }"
3. "Extracted userData: { ... }"
4. "User type: BRAND" (or INFLUENCER, or whatever type)
5. "✅ userData stored in localStorage: { ... }"
6. "Determining redirect - userType: BRAND"
7. "Final redirect URL: /brand/dashboard"
```

### 6. **Check Application Tab**
- Click **Storage** → **Local Storage** → **http://localhost:3000**
- Verify these keys exist:
  - ✅ `authToken` = (some JWT token)
  - ✅ `userData` = (JSON object with `type` field)
  - ✅ `userEmail` = (your test email)

- Click **Storage** → **Cookies** → **localhost**
- Verify:
  - ✅ `authToken` cookie exists

### 7. **Expected Results**
After login, you should see:
- 🎯 Redirect to **/brand/dashboard** (if BRAND user)
- 🎯 Redirect to **/influencer/dashboard** (if INFLUENCER user)
- 🚫 NOT redirect to **/

### 8. **If Redirect Goes to Homepage (/)**
Check these in Console:
```javascript
// Manually check what's stored
console.log('authToken:', localStorage.getItem('authToken'));
console.log('userData:', localStorage.getItem('userData'));
const userData = JSON.parse(localStorage.getItem('userData') || '{}');
console.log('userData.type:', userData.type);  // THIS SHOULD NOT BE UNDEFINED!
```

### 9. **If userData.type is MISSING**
Run this test to verify backend is working:
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"yourpassword"}'
```

The response should include a `user` object with a `type` field:
```json
{
  "message": "Login successful",
  "token": "...",
  "user": {
    "_id": "...",
    "email": "test@example.com",
    "type": "BRAND",     ← THIS MUST BE HERE!
    "name": "...",
    ...
  }
}
```

### 10. **If Backend Response is Missing `type`**
This means the MongoDB discriminator fix didn't work properly. The backend models need to be fixed.

---

## What to Report Back

After following these steps, provide:
1. Screenshot of Console tab showing the debug messages
2. Screenshot of Application tab showing localStorage contents
3. Copy-paste of the curl response from the backend
4. What URL you're being redirected to (/ or correct dashboard)

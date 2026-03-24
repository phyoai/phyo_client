// Debug script to check authentication storage
// Run this in browser console after login attempt

export const debugAuth = () => {
  console.log('=== AUTHENTICATION DEBUG ===\n');

  // Check localStorage
  console.log('📦 LocalStorage:');
  console.log('  authToken:', localStorage.getItem('authToken') ? '✅ EXISTS' : '❌ MISSING');
  console.log('  userData:', localStorage.getItem('userData') ? '✅ EXISTS' : '❌ MISSING');
  console.log('  userEmail:', localStorage.getItem('userEmail') ? '✅ EXISTS' : '❌ MISSING');

  // Parse and check userData
  const userDataStr = localStorage.getItem('userData');
  if (userDataStr) {
    try {
      const userData = JSON.parse(userDataStr);
      console.log('\n👤 UserData Details:');
      console.log('  Full userData:', userData);
      console.log('  type:', userData.type || '❌ MISSING TYPE!');
      console.log('  email:', userData.email);
      console.log('  _id:', userData._id);
    } catch (e) {
      console.error('❌ Failed to parse userData:', e);
    }
  }

  // Check cookies
  console.log('\n🍪 Cookies:');
  const cookieStr = document.cookie;
  const hasAuthToken = cookieStr.includes('authToken=');
  console.log('  authToken cookie:', hasAuthToken ? '✅ EXISTS' : '❌ MISSING');
  console.log('  All cookies:', cookieStr || '(none)');

  // Check window location
  console.log('\n📍 Current Location:');
  console.log('  URL:', window.location.href);
  console.log('  Path:', window.location.pathname);
};

// Also expose a function to manually set debug data
export const setDebugAuth = (type = 'BRAND') => {
  const testData = {
    _id: '123456',
    email: 'test@example.com',
    type: type,
    name: 'Test User'
  };
  localStorage.setItem('authToken', 'test-token-12345');
  localStorage.setItem('userData', JSON.stringify(testData));
  console.log('✅ Debug auth set:', testData);
  return testData;
};

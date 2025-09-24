import Cookies from 'js-cookie';

export function handleAuthError(error: any, router?: any) {
  if (error.status === 401 || (error.message && error.message.includes('Authentication required'))) {
    // Clear any invalid tokens
    Cookies.remove('uiw_jwt');
    
    // Redirect to login if router is available
    if (router) {
      router.push('/');
    } else {
      window.location.href = '/';
    }
    return true;
  }
  return false;
}

export async function authFetch(url: string, options: RequestInit = {}) {
  const defaultOptions: RequestInit = {
    ...options,
    credentials: 'include', // This ensures cookies are sent
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (response.status === 401) {
      handleAuthError({ status: 401 });
      throw new Error('Authentication required');
    }
    
    return response;
  } catch (error) {
    console.error('Auth fetch error:', error);
    throw error;
  }
}

export function isAuthenticated(): boolean {
  return !!Cookies.get('uiw_jwt');
}
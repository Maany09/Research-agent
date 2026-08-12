const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function submitResearch(topic) {
  const response = await fetch(`${API_BASE_URL}/api/research`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to fetch research from server.');
  }

  return response.json();
}

export async function saveResearch(dataString) {
  const response = await fetch(`${API_BASE_URL}/api/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: dataString }),
  });

  if (!response.ok) {
    throw new Error('Failed to save research.');
  }

  return response.json();
}

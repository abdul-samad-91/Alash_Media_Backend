# Frontend Integration Guide

This guide shows how to integrate the Alash Media Backend API with your frontend application.

## API Base URL

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## Authentication Setup

### 1. Login and Get Token

```javascript
const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      // Store token in localStorage or sessionStorage
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
```

### 2. Create API Request Helper

```javascript
// helper/api.js
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

// GET request
export const apiGet = (endpoint) => {
  return apiCall(endpoint, { method: 'GET' });
};

// POST request
export const apiPost = (endpoint, body) => {
  return apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

// PUT request
export const apiPut = (endpoint, body) => {
  return apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

// DELETE request
export const apiDelete = (endpoint) => {
  return apiCall(endpoint, { method: 'DELETE' });
};
```

## Fetching Data Examples

### Get All Blogs

```javascript
import { apiGet } from './helper/api';

const getBlogs = async (page = 1, limit = 10) => {
  try {
    const data = await apiGet(`/blogs?page=${page}&limit=${limit}&status=published`);
    console.log('Blogs:', data.data);
    return data.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }
};
```

### Get Blog Details by Slug

```javascript
const getBlogBySlug = async (slug) => {
  try {
    const data = await apiGet(`/blogs/slug/${slug}`);
    console.log('Blog:', data.data);
    return data.data;
  } catch (error) {
    console.error('Error fetching blog:', error);
  }
};
```

### Get All Authors

```javascript
const getAuthors = async () => {
  try {
    const data = await apiGet('/authors?page=1&limit=50');
    return data.data;
  } catch (error) {
    console.error('Error fetching authors:', error);
  }
};
```

### Get Author with Blogs

```javascript
const getAuthorWithBlogs = async (authorId, page = 1) => {
  try {
    const data = await apiGet(`/authors/${authorId}?page=${page}&limit=5`);
    return data.data;
  } catch (error) {
    console.error('Error fetching author:', error);
  }
};
```

### Get Categories

```javascript
const getCategories = async () => {
  try {
    const data = await apiGet('/categories?parentOnly=false');
    return data.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};
```

### Get Active Banners

```javascript
const getBanners = async () => {
  try {
    const data = await apiGet('/banners?activeOnly=true&limit=10');
    return data.data;
  } catch (error) {
    console.error('Error fetching banners:', error);
  }
};
```

### Get Active Votes

```javascript
const getVotes = async () => {
  try {
    const data = await apiGet('/votes?activeOnly=true');
    return data.data;
  } catch (error) {
    console.error('Error fetching votes:', error);
  }
};
```

### Get Galleries

```javascript
const getGalleries = async (type = 'photo') => {
  try {
    const data = await apiGet(`/galleries?type=${type}&limit=20`);
    return data.data;
  } catch (error) {
    console.error('Error fetching galleries:', error);
  }
};
```

## Admin/Editor Operations

### Create Blog (Requires Authentication)

```javascript
import { apiPost } from './helper/api';

const createBlog = async (blogData) => {
  try {
    const data = await apiPost('/blogs', {
      title: blogData.title,
      shortDescription: blogData.shortDescription,
      content: blogData.content,
      featuredImage: blogData.featuredImage,
      author: blogData.authorId,
      category: blogData.categoryId,
      status: 'draft', // 'draft' or 'published'
    });
    return data.data;
  } catch (error) {
    console.error('Error creating blog:', error);
  }
};
```

### Update Blog

```javascript
import { apiPut } from './helper/api';

const updateBlog = async (blogId, updates) => {
  try {
    const data = await apiPut(`/blogs/${blogId}`, updates);
    return data.data;
  } catch (error) {
    console.error('Error updating blog:', error);
  }
};
```

### Delete Blog

```javascript
import { apiDelete } from './helper/api';

const deleteBlog = async (blogId) => {
  try {
    await apiDelete(`/blogs/${blogId}`);
    console.log('Blog deleted successfully');
  } catch (error) {
    console.error('Error deleting blog:', error);
  }
};
```

### Create Category

```javascript
const createCategory = async (categoryData) => {
  try {
    const data = await apiPost('/categories', {
      name: categoryData.name,
      description: categoryData.description,
      parentCategory: categoryData.parentId || null,
    });
    return data.data;
  } catch (error) {
    console.error('Error creating category:', error);
  }
};
```

### Create Author

```javascript
const createAuthor = async (authorData) => {
  try {
    const data = await apiPost('/authors', {
      name: authorData.name,
      photo: authorData.photo,
      shortBio: authorData.shortBio,
    });
    return data.data;
  } catch (error) {
    console.error('Error creating author:', error);
  }
};
```

### Create Banner

```javascript
const createBanner = async (bannerData) => {
  try {
    const data = await apiPost('/banners', {
      title: bannerData.title,
      description: bannerData.description,
      image: bannerData.image,
      link: bannerData.link,
      position: bannerData.position,
      startDate: bannerData.startDate,
      endDate: bannerData.endDate,
    });
    return data.data;
  } catch (error) {
    console.error('Error creating banner:', error);
  }
};
```

### Create Vote

```javascript
const createVote = async (voteData) => {
  try {
    const data = await apiPost('/votes', {
      title: voteData.title,
      description: voteData.description,
      image: voteData.image,
      options: voteData.options, // ['Option 1', 'Option 2', ...]
      startDate: voteData.startDate,
      endDate: voteData.endDate,
    });
    return data.data;
  } catch (error) {
    console.error('Error creating vote:', error);
  }
};
```

### Cast Vote (Public)

```javascript
const castVote = async (voteId, optionIndex) => {
  try {
    const data = await apiPost(`/votes/${voteId}/cast`, {
      optionIndex: optionIndex,
    });
    return data.data;
  } catch (error) {
    console.error('Error casting vote:', error);
  }
};
```

### Create Gallery

```javascript
const createGallery = async (galleryData) => {
  try {
    const data = await apiPost('/galleries', {
      title: galleryData.title,
      description: galleryData.description,
      type: galleryData.type, // 'photo' or 'video'
      category: galleryData.category,
      items: galleryData.items || [],
    });
    return data.data;
  } catch (error) {
    console.error('Error creating gallery:', error);
  }
};
```

### Add Item to Gallery

```javascript
const addGalleryItem = async (galleryId, item) => {
  try {
    const data = await apiPost(`/galleries/${galleryId}/items`, {
      title: item.title,
      url: item.url,
      thumbnail: item.thumbnail,
      description: item.description,
    });
    return data.data;
  } catch (error) {
    console.error('Error adding gallery item:', error);
  }
};
```

## React Hooks Example

```javascript
// hooks/useFetch.js
import { useState, useEffect } from 'react';
import { apiGet } from '../helper/api';

export const useFetch = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiGet(endpoint);
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};

// Usage in component
import { useFetch } from '../hooks/useFetch';

function BlogList() {
  const { data: blogs, loading, error } = useFetch('/blogs?page=1&limit=10&status=published');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {blogs?.map((blog) => (
        <div key={blog._id}>
          <h2>{blog.title}</h2>
          <p>{blog.shortDescription}</p>
        </div>
      ))}
    </div>
  );
}
```

## Error Handling

```javascript
const handleApiError = (error) => {
  if (error.message === 'Invalid or expired token') {
    // Token expired, redirect to login
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  } else if (error.message === 'Not authorized to access this resource') {
    // Permission denied
    console.error('You do not have permission to perform this action');
  } else {
    // Generic error
    console.error('An error occurred:', error.message);
  }
};
```

## CORS Setup

Make sure your frontend and backend handle CORS correctly. The backend is already configured with CORS support, but ensure:

1. Frontend domain is allowed (or use wildcard for development)
2. Credentials/tokens are properly included in requests
3. Content-Type headers are set correctly

## Pagination Example

```javascript
const [page, setPage] = useState(1);
const [limit, setLimit] = useState(10);
const [blogs, setBlogs] = useState([]);
const [totalPages, setTotalPages] = useState(0);

const loadBlogs = async () => {
  try {
    const data = await apiGet(`/blogs?page=${page}&limit=${limit}&status=published`);
    setBlogs(data.data);
    setTotalPages(data.pagination.pages);
  } catch (error) {
    console.error('Error loading blogs:', error);
  }
};

useEffect(() => {
  loadBlogs();
}, [page, limit]);

// UI
<div>
  {blogs.map((blog) => (
    <BlogCard key={blog._id} blog={blog} />
  ))}
  <Pagination
    current={page}
    total={totalPages}
    onPageChange={setPage}
  />
</div>
```

## Search Example

```javascript
const [searchTerm, setSearchTerm] = useState('');

const searchBlogs = async (query) => {
  try {
    const data = await apiGet(`/blogs?search=${query}&page=1&limit=10`);
    return data.data;
  } catch (error) {
    console.error('Error searching blogs:', error);
  }
};

// Debounced search
import { useMemo } from 'react';
import debounce from 'lodash/debounce';

const handleSearch = useMemo(
  () =>
    debounce(async (query) => {
      if (query.length > 2) {
        const results = await searchBlogs(query);
        setSearchResults(results);
      }
    }, 300),
  []
);
```

## Best Practices

1. **Always handle errors** - Wrap API calls in try-catch
2. **Show loading states** - Use loading indicators while fetching
3. **Cache responses** - Use React Query or SWR for better caching
4. **Validate data** - Validate API responses before using
5. **Use environment variables** - Store API URL in `.env` file
6. **Implement retry logic** - Retry failed requests automatically
7. **Set request timeouts** - Prevent hanging requests
8. **Log errors** - Keep track of API errors for debugging

## Next Steps

1. Integrate API calls into your components
2. Implement state management (Redux, Context API, etc.)
3. Add form validation
4. Create reusable API service modules
5. Test all endpoints
6. Deploy to production

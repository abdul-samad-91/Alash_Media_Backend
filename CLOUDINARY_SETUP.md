# Cloudinary Upload API Documentation

## Setup

### 1. Install Cloudinary
```bash
npm install cloudinary
```

### 2. Get Cloudinary Credentials
1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up or login
3. Go to Dashboard
4. Copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 3. Configure .env
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## API Endpoints

### 1. Upload Single File
**POST** `/api/upload/single`

**Request:**
- Method: `POST`
- Header: `Content-Type: multipart/form-data`
- Body:
  - `file` (required): File to upload
  - `folder` (optional): Cloudinary folder name (default: "alash-media")

**Example (JavaScript/Fetch):**
```javascript
const formData = new FormData();
formData.append('file', file); // File object from input
formData.append('folder', 'blog-images');

const response = await fetch('/api/upload/single', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
console.log(data.data.url); // Cloudinary URL
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/.../image.jpg",
    "public_id": "alash-media/image",
    "size": 102400
  }
}
```

---

### 2. Upload Multiple Files
**POST** `/api/upload/multiple`

**Request:**
- Method: `POST`
- Header: `Content-Type: multipart/form-data`
- Body:
  - `files` (required): Multiple files
  - `folder` (optional): Cloudinary folder name

**Example (JavaScript/Fetch):**
```javascript
const formData = new FormData();
files.forEach(file => {
  formData.append('files', file);
});

const response = await fetch('/api/upload/multiple', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
console.log(data.data); // Array of uploaded files
```

**Response:**
```json
{
  "success": true,
  "message": "Files uploaded",
  "data": [
    {
      "url": "https://res.cloudinary.com/.../image1.jpg",
      "public_id": "alash-media/image1",
      "size": 102400
    },
    {
      "url": "https://res.cloudinary.com/.../image2.jpg",
      "public_id": "alash-media/image2",
      "size": 204800
    }
  ]
}
```

---

### 3. Delete File
**DELETE** `/api/upload`

**Request:**
- Method: `DELETE`
- Header: `Content-Type: application/json`
- Header: `Authorization: Bearer <token>` (admin only)
- Body:
  ```json
  {
    "publicId": "alash-media/image",
    "resourceType": "image"
  }
  ```

**Example (JavaScript/Fetch):**
```javascript
const response = await fetch('/api/upload', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    publicId: 'alash-media/image',
    resourceType: 'image'
  })
});
```

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

## Usage Examples

### React Component Example
```javascript
import { useState } from 'react';

export default function ImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'blog-images');

    try {
      const response = await fetch('/api/upload/single', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setImageUrl(data.data.url);
        console.log('Public ID:', data.data.public_id);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
}
```

---

## Supported File Types
- **Images:** JPEG, PNG, GIF, WebP
- **Videos:** MP4, MPEG
- **Documents:** PDF, DOC, DOCX

## File Size Limits
- Maximum file size: 50MB

## Cloudinary Resources
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Upload API Reference](https://cloudinary.com/documentation/upload_widget)

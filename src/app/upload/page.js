'use client';
import { useState } from 'react';

export default function UploadPage() {
  const [image, setImage] = useState(null);
  const [comment, setComment] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Upload logic here
    const formData = new FormData();
    formData.append('image', image);
    formData.append('comment', comment);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      alert('Upload successful!');
    } else {
      alert('Upload failed.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Upload Image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full mb-4"
        />
        <textarea
          placeholder="Add a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
        >
          Upload
        </button>
      </form>
    </div>
  );
}

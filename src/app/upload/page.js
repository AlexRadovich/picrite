'use client';

import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function UploadPage() {
  const [image, setImage] = useState(null);
  const [comment, setComment] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert('Please select an image to upload.');
      return;
    }

    setUploading(true);

    // Get the currently logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert('You must be signed in to upload.');
      setUploading(false);
      return;
    }

    // Create file path
    const fileExt = image.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('images') // your bucket name
      .upload(filePath, image, {
        contentType: image.type,
      });

    if (uploadError) {
      alert('Failed to upload image: ' + uploadError.message);
      setUploading(false);
      return;
    }

    // Public image URL
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${filePath}`;

    // Insert post record
    const { error: insertError } = await supabase.from('posts').insert({
      user_id: user.id,
      image_url: imageUrl,
      caption: comment,
    });

    if (insertError) {
      alert('Failed to save post: ' + insertError.message);
    } else {
      alert('Upload successful!');
      setImage(null);
      setComment('');
    }

    setUploading(false);
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
          disabled={uploading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}

'use client';

import { supabase } from '@/lib/supabaseClient';
import { useState, useRef } from 'react';

export default function UploadPage() {
  const [image, setImage] = useState(null);
  const [comment, setComment] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

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
  
    // 🔍 Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
  
    if (userError || !user) {
      console.error('🔴 Supabase user error:', userError);
      alert('You must be signed in to upload.');
      setUploading(false);
      return;
    }
  
    console.log('🟢 Supabase user:', user);
  
    // 🗂 Create file path
    const fileExt = image.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;
  
    // ☁️ Upload image
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, image, {
        contentType: image.type,
      });
  
    if (uploadError) {
      console.error('🛑 Upload error:', uploadError);
      alert('Failed to upload image: ' + uploadError.message);
      setUploading(false);
      return;
    }
  
    // 🌐 Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
  
    const imageUrl = publicUrlData?.publicUrl;
  
    // 📝 Insert post using .insert([...]).select()
    const { data: insertedData, error: insertError } = await supabase
      .from('posts')
      .insert([
        {
          user_id: user.id,
          image_url: imageUrl,
          caption: comment,
        },
      ])
      .select();
  
    if (insertError) {
      console.error('🛑 Insert error:', insertError);
      alert('Failed to save post: ' + insertError.message);
    } else {
      console.log('✅ Inserted post:', insertedData);
      alert('Upload successful!');
      setImage(null);
      setComment('');
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  
    setUploading(false);
  };
  

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Upload Image</h2>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full mb-4"
        />

        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="mb-4 rounded max-h-64 w-full object-contain"
          />
        )}

        <textarea
          placeholder="Add a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <button
          type="submit"
          disabled={uploading}
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded ${
            uploading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}

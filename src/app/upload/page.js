'use client';

import { supabase } from '@/lib/supabaseClient';
import { useState, useRef } from 'react';
import NavBar from '@/components/NavBar';

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

    // Get the logged-in user and their display name
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

    // Fetch the display name for the logged-in user
    const { data: userData, error: userDataError } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single(); // Fetch a single record for the current user

    if (userDataError || !userData) {
      console.error('🔴 Error fetching user data:', userDataError);
      alert('Error fetching your profile data.');
      setUploading(false);
      return;
    }

    const displayName = userData.display_name;

    const fileExt = image.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    // Upload the image to Supabase Storage
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

    // Get the public URL of the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData?.publicUrl;

    // Insert post into the 'posts' table
    const { data: insertedData, error: insertError } = await supabase
      .from('posts')
      .insert([
        {
          user_id: user.id,
          display_name: displayName, // Adding display name
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
    <div className="min-h-screen bg-[#B0C4DE]">
      <header>
        <NavBar />
      </header>

      {/* Upload Form */}
      <div className="flex justify-center items-center  pt-10">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 p-6  text-[#909080] rounded shadow w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-4  text-[#821019] text-center">Upload Image</h2>

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
            className="w-full p-2 border text-[#2a2e49] border-gray-300 rounded mb-4"
          />

          <button
            type="submit"
            disabled={uploading}
            className={`w-full bg-[#2a2e49] hover:bg-blue-600 text-white font-semibold py-2 rounded ${
              uploading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
}

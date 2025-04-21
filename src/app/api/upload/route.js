import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req) {
  const supabase = createRouteHandlerClient({ cookies });

  const formData = await req.formData();
  const file = formData.get('file');
  const caption = formData.get('caption');

  if (!file || typeof file === 'string') {
    return new Response(JSON.stringify({ error: 'Invalid file upload' }), {
      status: 400,
    });
  }

  // Get the user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  const fileExt = file.name.split('.').pop();
  const filePath = `${user.id}/${Date.now()}.${fileExt}`;

  // Upload image to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('images') // your bucket name
    .upload(filePath, file, {
      contentType: file.type,
    });

  if (uploadError) {
    return new Response(JSON.stringify({ error: uploadError.message }), {
      status: 500,
    });
  }

  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${filePath}`;

  // Save metadata to 'posts' table
  const { error: insertError } = await supabase.from('posts').insert({
    user_id: user.id,
    image_url: imageUrl,
    caption,
  });

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true, imageUrl }), {
    status: 200,
  });
}

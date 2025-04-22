// import { createeRouteHandlerClient } from '@supabase/ssr';
// import { cookies } from 'next/headers';

// export async function POST(req) {
//   const cookieStore = cookies();
//   const supabase = createeRouteHandlerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL,
//     process.env.SUPABASE_SERVICE_ROLE_KEY, // or ANON_KEY depending on use case
//     {
//       cookies: () => cookieStore,
//     }
//   );

//   const {
//     data: { user },
//     error: userError,
//   } = await supabase.auth.getUser();

//   if (userError || !user) {
//     return new Response(JSON.stringify({ error: 'Unauthorized' }), {
//       status: 401,
//     });
//   }

//   // Example: parse form data (assuming JSON for simplicity)
//   const body = await req.json();
//   const { imageUrl, caption } = body;

//   const { data, error } = await supabase.from('posts').insert([
//     {
//       user_id: user.id,
//       image_url: imageUrl,
//       caption: caption,
//     },
//   ]);

//   if (error) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }

//   return new Response(JSON.stringify({ message: 'Upload successful', data }), {
//     status: 200,
//   });
// }

import { createClient, SupabaseClientOptions } from '@supabase/supabase-js';

export const createSupabaseClient = (access_token?: string) => {
    let options: SupabaseClientOptions<'public'> | undefined;
    if (access_token) {
        options = {
            global: {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            },
        };
    }

    return createClient(
        process.env['SUPABASE_URL']!, //
        process.env['SUPABASE_ACCESS_TOKEN']!,
        options,
    );
};

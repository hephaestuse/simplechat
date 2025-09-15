import { supabase } from "../lib/supabase/supabase"

export async function sendMessage(conversation_id, sender_id, message) {

    const { data, error } = await supabase
        .from('messages')
        .insert([
            { conversation_id, sender_id, content: message },
        ])
        .select()


    if (error) {
        return { sucsess: false, data: error }
    }
    return { sucsess: true, data }
}

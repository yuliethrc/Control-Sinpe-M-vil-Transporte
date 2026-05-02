import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://friyokjbbjdtxhgyzsbz.supabase.co';
const supabaseKey = 'sb_publishable_8S-9PBGA-O-tJCS9kPqxoQ_kHskgOiv';
const supabase = createClient(supabaseUrl, supabaseKey);

export const api = {
    getSinpes: async () => {
        const { data, error } = await supabase
            .from('sinpe_records')
            .select('*')
            .order('date', { ascending: false });
        if (error) throw error;
        return data;
    },

    getPendientes: async () => {
        const { data, error } = await supabase
            .from('sinpe_records')
            .select('*')
            .eq('state', 'No confirmado')
            .order('date', { ascending: false });
        if (error) throw error;
        return data;
    },

    createSinpe: async (record) => {
        const { data, error } = await supabase
            .from('sinpe_records')
            .insert([record])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    updateSinpe: async (id, record) => {
        const { data, error } = await supabase
            .from('sinpe_records')
            .update(record)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    toggleState: async (id) => {
        // Primero obtener el estado actual
        const { data: current, error: fetchError } = await supabase
            .from('sinpe_records')
            .select('state')
            .eq('id', id)
            .single();
        if (fetchError) throw fetchError;

        const newState = current.state === 'No confirmado' ? 'Confirmado' : 'No confirmado';
        const { error } = await supabase
            .from('sinpe_records')
            .update({ state: newState })
            .eq('id', id);
        if (error) throw error;
        return { status: 'ok', new_state: newState };
    },

    deleteSinpe: async (id) => {
        const { error } = await supabase
            .from('sinpe_records')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return { status: 'deleted' };
    },

    // --- Métodos de Autenticación ---
    login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    getSession: async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    }
};

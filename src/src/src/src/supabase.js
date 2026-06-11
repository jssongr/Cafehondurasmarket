import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function registrarUsuario({ nombre, email, password, rol, telefono, dpiUrl, selfieUrl }) {
  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
  if (authError) throw authError

  const { data, error } = await supabase
    .from('usuarios')
    .insert([{ id: authData.user.id, nombre, email, rol, telefono,
      dpi_url: dpiUrl, selfie_url: selfieUrl, verificado: true,
      created_at: new Date().toISOString() }])
    .select().single()
  if (error) throw error
  return data
}

export async function iniciarSesion({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  const { data: perfil, error: perfilError } = await supabase
    .from('usuarios').select('*').eq('id', data.user.id).single()
  if (perfilError) throw perfilError
  return perfil
}

export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function obtenerUsuarioPorId(id) {
  const { data, error } = await supabase
    .from('usuarios').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function actualizarPerfil(id, cambios) {
  const { data, error } = await supabase
    .from('usuarios').update(cambios).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function subirImagen(archivo, carpeta) {
  const nombre = `${carpeta}/${Date.now()}-${archivo.name}`
  const { data, error } = await supabase.storage
    .from('documentos').upload(nombre, archivo)
  if (error) throw error
  const { data: urlData } = supabase.storage
    .from('documentos').getPublicUrl(nombre)
  return urlData.publicUrl
}

export async function crearPublicacion(pub) {
  const { data, error } = await supabase
    .from('publicaciones').insert([pub]).select().single()
  if (error) throw error
  return data
}

export async function obtenerPublicaciones(filtros = {}) {
  let query = supabase.from('publicaciones')
    .select(`*, usuarios(nombre, rol, verificado, selfie_url)`)
    .order('created_at', { ascending: false })
  if (filtros.tipo) query = query.eq('tipo', filtros.tipo)
  if (filtros.variedad) query = query.eq('variedad', filtros.variedad)
  if (filtros.departamento) query = query.eq('departamento', filtros.departamento)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function eliminarPublicacion(id) {
  const { error } = await supabase.from('publicaciones').delete().eq('id', id)
  if (error) throw error
}

export async function obtenerConversaciones(usuarioId) {
  const { data, error } = await supabase.from('conversaciones')
    .select(`*, mensajes(*)`)
    .or(`usuario1_id.eq.${usuarioId},usuario2_id.eq.${usuarioId}`)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data
}

export async function enviarMensaje({ conversacionId, deId, texto, tipo = 'texto', precio = null }) {
  const { data, error } = await supabase.from('mensajes')
    .insert([{ conversacion_id: conversacionId, de_id: deId, texto, tipo, precio,
      created_at: new Date().toISOString() }]).select().single()
  if (error) throw error
  await supabase.from('conversaciones')
    .update({ updated_at: new Date().toISOString() }).eq('id', conversacionId)
  return data
}

export async function crearConversacion({ usuario1Id, usuario2Id, publicacionId }) {
  const { data: existe } = await supabase.from('conversaciones').select('*')
    .or(`and(usuario1_id.eq.${usuario1Id},usuario2_id.eq.${usuario2Id}),and(usuario1_id.eq.${usuario2Id},usuario2_id.eq.${usuario1Id})`)
    .eq('publicacion_id', publicacionId).single()
  if (existe) return existe
  const { data, error } = await supabase.from('conversaciones')
    .insert([{ usuario1_id: usuario1Id, usuario2_id: usuario2Id,
      publicacion_id: publicacionId, created_at: new Date().toISOString(),
      updated_at: new Date().toISOString() }]).select().single()
  if (error) throw error
  return data
}

export function escucharMensajes(conversacionId, callback) {
  return supabase.channel(`mensajes-${conversacionId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public',
      table: 'mensajes', filter: `conversacion_id=eq.${conversacionId}` }, callback)
    .subscribe()
}

export async function obtenerNotificaciones(usuarioId) {
  const { data, error } = await supabase.from('notificaciones')
    .select('*').eq('usuario_id', usuarioId)
    .order('created_at', { ascending: false }).limit(30)
  if (error) throw error
  return data
}

export async function crearNotificacion({ usuarioId, tipo, titulo, sub }) {
  const { error } = await supabase.from('notificaciones')
    .insert([{ usuario_id: usuarioId, tipo, titulo, sub, leida: false,
      created_at: new Date().toISOString() }])
  if (error) throw error
}

export async function marcarNotifsLeidas(usuarioId) {
  const { error } = await supabase.from('notificaciones')
    .update({ leida: true }).eq('usuario_id', usuarioId)
  if (error) throw error
}

export async function obtenerHistorial(usuarioId) {
  const { data, error } = await supabase.from('transacciones')
    .select('*').or(`comprador_id.eq.${usuarioId},vendedor_id.eq.${usuarioId}`)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function crearTransaccion(tx) {
  const { data, error } = await supabase.from('transacciones')
    .insert([tx]).select().single()
  if (error) throw error
  return data
}

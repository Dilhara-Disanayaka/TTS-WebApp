import { supabase } from './supabase'

export class AudioUploadService {
  constructor() {
    this.bucketName = 'audio_files'
  }

  async uploadAudio(audioBlob, userId, metadata = {}) {
    try {
      if (!userId) {
        throw new Error('User ID is required')
      }

      const audioId = crypto.randomUUID()
      const filename = `${audioId}_${Date.now()}.wav`
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(this.bucketName)
        .upload(filename, audioBlob, {
          contentType: 'audio/wav',
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filename)

      // Calculate file size
      const size = Math.round(audioBlob.size / 1024) // KB

      // Insert metadata into database
      const { data: dbData, error: dbError } = await supabase
        .from('audio')
        .insert({
          id: audioId,
          user_id: userId,
          url: publicUrl,
          size: size,
          duration: metadata.duration || null,
          text: metadata.text || null,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (dbError) {
        // If database insert fails, clean up the uploaded file
        await this.deleteAudio(filename)
        throw dbError
      }

      return {
        id: audioId,
        url: publicUrl,
        size,
        duration: metadata.duration,
        created_at: dbData.created_at
      }
    } catch (error) {
      console.error('Audio upload failed:', error)
      throw error
    }
  }

  async deleteAudio(filename) {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filename])

      if (error) {
        console.error('Failed to delete audio file:', error)
      }
    } catch (error) {
      console.error('Error deleting audio:', error)
    }
  }

  async getUserAudioHistory(userId, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('audio')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Failed to fetch audio history:', error)
      throw error
    }
  }

  async deleteUserAudio(audioId, userId) {
    try {
      // First get the audio record to find the filename
      const { data: audioRecord, error: fetchError } = await supabase
        .from('audio')
        .select('url')
        .eq('id', audioId)
        .eq('user_id', userId)
        .single()

      if (fetchError) {
        throw fetchError
      }

      // Extract filename from URL
      const filename = audioRecord.url.split('/').pop()

      // Delete from storage
      await this.deleteAudio(filename)

      // Delete from database
      const { error: deleteError } = await supabase
        .from('audio')
        .delete()
        .eq('id', audioId)
        .eq('user_id', userId)

      if (deleteError) {
        throw deleteError
      }

      return true
    } catch (error) {
      console.error('Failed to delete user audio:', error)
      throw error
    }
  }
}

export const audioUploadService = new AudioUploadService()
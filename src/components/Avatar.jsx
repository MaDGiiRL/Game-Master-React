import { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabase-client';
import Swal from 'sweetalert2';

export default function Avatar({ url, size = 150, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) {
      // Se url è un URL completo, estrai solo il filename
      const path = extractPathFromUrl(url);
      downloadImage(path);
    } else {
      setAvatarUrl(null);
    }
  }, [url]);

  // Funzione per estrarre il percorso relativo dal full URL
  const extractPathFromUrl = (url) => {
    try {
      // Se url è un URL completo, estrae solo la parte finale dopo /avatars/
      const urlObj = new URL(url);
      const pathname = urlObj.pathname; // es: /storage/v1/object/public/avatars/filename.jpeg
      const parts = pathname.split('/avatars/');
      if (parts.length > 1) {
        return parts[1]; // filename.jpeg
      }
      return url; // se non è URL completo, ritorna quello che c'è
    } catch {
      // Se non è un URL valido, ritorna il valore così com'è
      return url;
    }
  };

  const downloadImage = async (path) => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) throw error;

      const imageUrl = URL.createObjectURL(data);
      setAvatarUrl(imageUrl);
    } catch (error) {
      console.error('Errore durante il download dell\'immagine:', error.message);
      setAvatarUrl(null);

      Swal.fire({
        icon: 'error',
        title: 'Errore',
        text: `Errore durante il download dell'immagine: ${error.message}`,
      });
    }
  };

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Devi selezionare un\'immagine da caricare.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (uploadError) throw uploadError;

      onUpload(event, filePath);

      Swal.fire({
        icon: 'success',
        title: 'Upload completato',
        text: 'La tua immagine è stata caricata con successo!',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Errore',
        text: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="avatar-wrapper" style={{ width: size, textAlign: 'center' }}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="avatar-image"
          style={{
            height: size,
            width: size,
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <div
          style={{
            height: size,
            width: size,
            borderRadius: '50%',
            backgroundColor: '#ccc',
          }}
        />
      )}
      <div style={{ marginTop: 10 }}>
        <label className="btn btn-primary" style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}>
          {uploading ? 'Caricamento...' : 'Carica nuova immagine'}
          <input
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
      </div>
    </div>
  );
}

# 🎮 Game Master

**Game Master** è una **Game Library Web App** sviluppata con **React 19** e **Tailwind CSS 4**, progettata per offrire un’interfaccia moderna, veloce e responsive per esplorare, cercare e gestire videogiochi tramite l’API pubblica di [RAWG](https://rawg.io/apidocs).

Il progetto include autenticazione, profili utente con **Supabase**, sistema di preferiti, gestione delle rotte con **React Router v7**, e componenti UI ottimizzati per la performance.

---

## 🧩 Funzionalità principali

- 🔍 **Ricerca giochi** con chiamate live all'API di RAWG  
- 📁 **Dettaglio gioco** con immagini, descrizioni e generi  
- ❤️ **Sistema di preferiti** con persistenza lato utente  
- 👤 **Autenticazione & profili utente** via [Supabase](https://supabase.com)  
- 🌐 **Routing dinamico** con React Router v7  
- 📱 **UI completamente responsive** con Tailwind CSS  
- 🖼️ **Lazy loading immagini** per migliorare le performance  
- 🍬 **Notifiche eleganti** con SweetAlert2  

---

## ⚙️ Tecnologie e librerie

| Tecnologia | Descrizione |
|-----------|-------------|
| ⚛️ [React 19](https://reactjs.org/) | Libreria per la creazione dell’interfaccia utente |
| 💨 [Tailwind CSS 4](https://tailwindcss.com/) | Framework utility-first per styling |
| 🛣️ [React Router v7](https://reactrouter.com/) | Gestione client-side delle rotte |
| 🧪 [Zod](https://zod.dev/) | Validazione e parsing dei dati |
| 🔐 [Supabase](https://supabase.com/) | Backend-as-a-Service per autenticazione e database |
| 🖼️ [react-lazy-load-image-component](https://www.npmjs.com/package/react-lazy-load-image-component) | Lazy loading immagini |
| 🎨 [SweetAlert2](https://sweetalert2.github.io/) | Modali e alert personalizzati |
| ⚙️ [Vite](https://vitejs.dev/) | Dev server e bundler ultra veloce |
| 🧹 [ESLint](https://eslint.org/) | Linter per mantenere il codice pulito e coerente |

---

## 📦 Avvio del progetto

Assicurati di avere **Node.js** installato. Poi:

```bash
# Clona il repository
git clone https://github.com/tuo-utente/game-master-react.git
cd game-master-react

# Installa le dipendenze
npm install

# Avvia il progetto in locale
npm run dev
```


---

## 🔐 Credenziali API

Per utilizzare l'API RAWG, crea un account gratuito su [https://rawg.io/apidocs](https://rawg.io/apidocs) e ottieni la tua chiave API, che andrà inserita in un file `.env.local`:

```env
VITE_SUPABASE_URL==la_tua_api_key
VITE_SUPABASE_KEY=https://your-project.supabase.co
```

---

## 👩‍💻 Autrice

> Developed with ❤️ by **Sofia Vidotto**  
> Web Developer & Gamer  
> © 2025 Game Master. All rights reserved.

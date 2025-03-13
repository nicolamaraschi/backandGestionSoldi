# Money Manager Application

Un'applicazione web completa per la gestione delle finanze personali, con backend RESTful API in Node.js/Express e frontend in React.

## Panoramica

Money Manager è un'applicazione che consente agli utenti di monitorare e gestire le proprie finanze personali, tenendo traccia di entrate e uscite, impostando budget, creando obiettivi di risparmio e visualizzando analisi dettagliate delle proprie abitudini finanziarie.

## Struttura del Progetto

```
money-manager/
├── backend/             # API Node.js/Express
│   ├── source/          # Codice sorgente backend
│   │   ├── config/      # Configurazioni
│   │   ├── controllers/ # Controller API
│   │   ├── middleware/  # Middleware
│   │   ├── models/      # Modelli MongoDB
│   │   └── routes/      # Route API
│   ├── .env             # Variabili d'ambiente
│   └── package.json     # Dipendenze backend
│
└── frontend/            # Applicazione React
    ├── public/          # Asset statici
    └── src/             # Codice sorgente frontend
        ├── components/  # Componenti React
        │   ├── analytics/     # Componenti per analisi
        │   ├── auth/          # Autenticazione
        │   ├── budgets/       # Gestione budget
        │   ├── categories/    # Gestione categorie
        │   ├── common/        # Componenti condivisi
        │   ├── dashboard/     # Dashboard principale
        │   ├── goals/         # Obiettivi di risparmio
        │   ├── movements/     # Entrate/uscite
        │   └── notifications/ # Notifiche
        ├── contexts/    # Context React
        ├── services/    # Servizi API
        └── utils/       # Utilità
```

## Funzionalità

- **Autenticazione**: Registrazione, login e gestione degli utenti
- **Dashboard**: Visualizzazione panoramica delle finanze personali
- **Movimenti**: Gestione di entrate e uscite
- **Categorie**: Organizzazione dei movimenti per categoria
- **Budget**: Pianificazione e monitoraggio dei budget per categoria
- **Obiettivi**: Impostazione e tracciamento degli obiettivi di risparmio
- **Analisi**: Grafici e visualizzazioni delle tendenze finanziarie
- **Notifiche**: Avvisi personalizzati sullo stato delle finanze

## Requisiti tecnici

### Backend

- Node.js (v16+)
- Express
- MongoDB
- JWT per autenticazione
- Mongoose come ORM

### Frontend

- React 18+
- React Router per la navigazione
- Material-UI per i componenti dell'interfaccia
- Chart.js per i grafici
- Axios per le chiamate API
- Context API per la gestione dello stato

## Installazione

### Backend

```bash
# Installa le dipendenze
cd backend
npm install

# Configura le variabili d'ambiente
cp .env.example .env
# Modifica il file .env con i tuoi parametri

# Avvia il server
npm start
```

### Frontend

```bash
# Installa le dipendenze
cd frontend
npm install

# Avvia l'applicazione
npm start
```

## Utilizzo

Una volta avviati sia il backend che il frontend:

1. Backend API: http://localhost:3000
2. Frontend App: http://localhost:3001

## API Endpoints

### Autenticazione

- `POST /api/auth/register` - Registrazione nuovo utente
- `POST /api/auth/login` - Login utente
- `POST /api/auth/logout` - Logout utente

### Movimenti

- `GET /api/movements` - Recupera tutti i movimenti
- `POST /api/movements` - Crea un nuovo movimento
- `PUT /api/movements/:id` - Aggiorna un movimento
- `DELETE /api/movements/:id` - Elimina un movimento

### Categorie

- `GET /api/categories` - Recupera tutte le categorie
- `POST /api/categories` - Crea una nuova categoria
- `PUT /api/categories/:id` - Aggiorna una categoria
- `DELETE /api/categories/:id` - Elimina una categoria

### Budget

- `GET /api/budgets` - Recupera tutti i budget
- `GET /api/budgets/:id` - Recupera un budget specifico
- `POST /api/budgets` - Crea un nuovo budget
- `PUT /api/budgets/:id` - Aggiorna un budget
- `DELETE /api/budgets/:id` - Elimina un budget

### Obiettivi

- `GET /api/goals` - Recupera tutti gli obiettivi
- `GET /api/goals/:id` - Recupera un obiettivo specifico
- `POST /api/goals` - Crea un nuovo obiettivo
- `PUT /api/goals/:id` - Aggiorna un obiettivo
- `DELETE /api/goals/:id` - Elimina un obiettivo

### Notifiche

- `GET /api/notifications` - Recupera tutte le notifiche
- `POST /api/notifications` - Crea una nuova notifica
- `PUT /api/notifications/:id` - Aggiorna una notifica
- `DELETE /api/notifications/:id` - Elimina una notifica

### Dashboard

- `GET /api/dashboard/movements` - Recupera i movimenti recenti
- `GET /api/dashboard/stats` - Recupera le statistiche
- `GET /api/dashboard/category-stats` - Statistiche per categoria
- `GET /api/dashboard/balance` - Saldo attuale
- `GET /api/dashboard/forecast` - Previsioni finanziarie

### Analytics

- `GET /api/analytics/overview` - Panoramica finanziaria
- `GET /api/analytics/trends` - Tendenze storiche
- `GET /api/analytics/comparison` - Confronto periodi

## Autenticazione e sicurezza

L'applicazione utilizza JSON Web Tokens (JWT) per gestire l'autenticazione degli utenti. Ogni richiesta API (eccetto login e registrazione) richiede un token valido nel header HTTP:

```
x-auth-token: YOUR_TOKEN_HERE
```

I token hanno una durata di validità di 1 ora, dopo la quale è necessario effettuare un nuovo login.

## Modelli di dati

### Utente
```
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  createdAt: Date
}
```

### Movimento
```
{
  _id: ObjectId,
  userId: ObjectId,
  type: "income" | "expense",
  amount: Number,
  category: String,
  description: String,
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Categoria
```
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  type: "income" | "expense",
  createdAt: Date
}
```

### Budget
```
{
  _id: ObjectId,
  userId: ObjectId,
  category: ObjectId,
  amount: Number,
  startDate: Date,
  endDate: Date,
  createdAt: Date
}
```

### Obiettivo
```
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  targetAmount: Number,
  currentAmount: Number,
  dueDate: Date,
  createdAt: Date
}
```

### Notifica
```
{
  _id: ObjectId,
  userId: ObjectId,
  message: String,
  isRead: Boolean,
  createdAt: Date
}
```

## Avvio dell'applicazione

Per avviare l'intera applicazione (backend e frontend contemporaneamente):

1. Installa `concurrently` come dipendenza di sviluppo nella root del progetto:
```bash
npm install --save-dev concurrently
```

2. Aggiungi questo script al package.json nella root:
```json
"scripts": {
  "backend": "cd backend && npm start",
  "frontend": "cd frontend && npm start",
  "dev": "concurrently \"npm run backend\" \"npm run frontend\""
}
```

3. Avvia l'intero stack con un solo comando:
```bash
npm run dev
```

## Contributi

Per contribuire al progetto:

1. Forka il repository
2. Crea un branch per la tua funzionalità (`git checkout -b feature/amazing-feature`)
3. Commit delle modifiche (`git commit -m 'Aggiungi una funzionalità'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Apri una Pull Request

## Licenza

Questo progetto è rilasciato sotto licenza MIT.
# Gestion des Cours - Application Mobile

Cette application mobile permet la gestion des cours et des informations utilisateur.

## Prérequis

- Node.js (version 16 ou supérieure)
- Vue.js 3
- Capacitor
- Android Studio (pour le développement Android)
- Xcode (pour le développement iOS, Mac uniquement)
- npm ou yarn

## Installation

1. Clonez le dépôt :
```bash
git clone [URL_DU_DEPOT]
cd gestion_cours_app
```

2. Installez les dépendances :
```bash
npm install
# ou
yarn install
```

3. Installez les plateformes mobiles :
```bash
npx cap add android
npx cap add ios
```

## Lancement de l'application

### Pour le développement web (navigateur)
```bash
npm run dev
# ou
yarn dev
```

### Pour Android
1. Construisez l'application :
```bash
npm run build
npx cap sync android
```

2. Ouvrez le projet dans Android Studio :
```bash
npx cap open android
```

3. Lancez l'application sur un émulateur ou un appareil connecté depuis Android Studio.

### Pour iOS (Mac uniquement)
1. Construisez l'application :
```bash
npm run build
npx cap sync ios
```

2. Ouvrez le projet dans Xcode :
```bash
npx cap open ios
```

3. Lancez l'application sur un simulateur ou un appareil connecté depuis Xcode.

## Fonctionnalités principales

### 1. Inscription (Sign Up)
- Création d'un nouveau compte utilisateur
- Validation des informations saisies
- Stockage sécurisé des données utilisateur

### 2. Connexion (Login)
- Authentification sécurisée des utilisateurs
- Gestion des sessions utilisateur
- Récupération du token d'authentification

### 3. Gestion du profil utilisateur
- Consultation des informations personnelles
- Modification des informations du profil
- Visualisation des cours associés

### 4. Gestion des cours
- Liste des cours disponibles
- Détails des cours (horaires, description, etc.)
- Inscription/désinscription aux cours

## Structure du projet

```
gestion_cours_app/
├── app/
│   ├── components/     # Composants Vue.js
│   ├── views/         # Pages de l'application
│   └── services/      # Services (API, authentification)
├── public/            # Ressources statiques
└── ...
```

## Sécurité

- Toutes les requêtes API sont sécurisées avec des tokens JWT
- Les mots de passe sont hashés avant stockage
- Les sessions utilisateur sont gérées de manière sécurisée

## Support

Pour toute question ou problème, veuillez ouvrir une issue dans le dépôt Git. 
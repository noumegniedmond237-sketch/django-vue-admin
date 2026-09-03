# Django-Vue-Admin (Version Française & Multilingue)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python >= 3.8](https://img.shields.io/badge/Python-%3E%3D%203.8-blue.svg)](https://python.org/)
[![Django 3.2+ / 4.x / 5.x / 6.x](https://img.shields.io/badge/Django-3.2%20--%206.x-green.svg)](https://www.djangoproject.com/)
[![Node.js >= 14.x](https://img.shields.io/badge/Node.js-%3E%3D%2014.x-brightgreen.svg)](https://nodejs.org/)
[![Vue.js 2.6](https://img.shields.io/badge/Vue.js-2.6.x-4fc08d.svg)](https://vuejs.org/)

**[Français](./README.md)** | **[English](./README.en.md)** | **[Dépôt GitHub](https://github.com/noumegniedmond237-sketch/django-vue-admin)**

---

## 📌 Présentation

**Django-Vue-Admin (DVA)** est une plateforme de développement rapide open source pour les applications de gestion et tableaux de bord d'entreprise.

Cette version a été entièrement **traduite en français**, modernisée et optimisée pour une exécution fluide sur Windows, Linux et macOS :
* **Frontend** : Vue 2 + Element-UI + D2Admin + VXE-Table.
* **Backend** : Python + Django + Django REST Framework (DRF) + SimpleJWT.
* **Internationalisation** : Support natif du **Français (par défaut)** et de l'**Anglais**.
* **Lanceur Automatique** : Script intelligent `run.bat` pour Windows avec vérification et installation automatique des dépendances.

---

## 🚀 Démarrage Rapide en 1 Clic (Windows)

Le projet intègre un script intelligent [`run.bat`](./run.bat) à la racine qui automatise l'ensemble du processus :
1. Vérification de la présence de Python et Node.js.
2. Création et activation de l'environnement virtuel Python (`backend\.venv_sys`).
3. Installation automatique des dépendances (`requirements.txt` et `package.json`).
4. Application des migrations de base de données et initialisation des données.
5. Démarrage simultané du backend Django et du frontend Vue.
6. Ouverture automatique du navigateur sur l'application.

```cmd
:: Double-cliquez simplement sur run.bat ou exécutez dans un terminal :
.\run.bat
```

---

## ⚙️ Installation Manuelle

### Prérequis
* **Python** : `>= 3.8.0` (compatible Python 3.10, 3.11, 3.12, 3.13)
* **Node.js** : `>= 14.0.0` (avec npm)
* **Base de données** : SQLite par défaut (prêt à l'emploi) ou MySQL / PostgreSQL

---

### 1. Démarrage du Backend (Django)

```bash
# 1. Accéder au dossier backend
cd backend

# 2. Créer et activer l'environnement virtuel
python -m venv .venv_sys

# Sur Windows :
.\.venv_sys\Scripts\activate
# Sur Linux / macOS :
# source .venv_sys/bin/activate

# 3. Installer les dépendances Python
pip install --upgrade pip
pip install -r requirements.txt

# 4. Appliquer les migrations de base de données
python manage.py migrate

# 5. Initialiser les fixtures système et les régions (première exécution)
python manage.py init
python manage.py init_area

# 6. Démarrer le serveur backend
python manage.py runserver 127.0.0.1:8000
```

> **Swagger / Documentation OpenAPI** disponible sur : [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

---

### 2. Démarrage du Frontend (Vue.js)

```bash
# 1. Accéder au dossier web
cd web

# 2. Installer les dépendances Node.js
npm install

# 3. Démarrer le serveur de développement
# (La variable NODE_OPTIONS est requise avec Node.js 17+)
npm run dev
```

> **Application Web** accessible sur : [http://localhost:8080/](http://localhost:8080/)

---

## 🔑 Identifiants de Connexion

| Paramètre | Valeur |
|---|---|
| **Identifiant** | `superadmin` |
| **Mot de passe** | `admin123456` |
| **Rôle** | Super Administrateur |

---

## ✨ Fonctionnalités Principales

1. **📊 Tableau de Bord Personnalisable (Workbench)** :
   * 13 widgets modulaires (statistiques, graphiques ECharts de trafic, répartition géographique, horloge, informations système).
   * Personnalisation par glisser-déposer, réorganisation et masquage des widgets.
2. **👥 Gestion des Utilisateurs & Rôles** :
   * CRUD complet, attribution des rôles, réinitialisation de mot de passe, avatar, départements.
   * Contrôle d'accès basé sur les rôles (RBAC) avec matrice de permissions fines.
3. **🏢 Gestion des Départements & Postes** :
   * Structure organisationnelle arborescente (entreprise, filiale, département, équipe).
4. **🧭 Gestion des Menus & Boutons** :
   * Menus dynamiques stockés en base de données, icônes SVG/FontAwesome, permissions de boutons individuelles.
5. **📖 Dictionnaire de Données Système** :
   * Gestion hiérarchique des listes de valeurs et codes système.
6. **🗺️ Gestion Régionale & Géographique** :
   * Découpage administratif complet (provinces, villes, districts).
7. **📁 Gestionnaire de Fichiers & Pièces Jointes** :
   * Upload de documents et images, recadrage intégré, prévisualisation et téléchargement.
8. **🛡️ Liste Blanche d'API & Sécurité** :
   * Configuration des endpoints publics sans authentification requise.
9. **📑 Journaux d'Audit & Connexions** :
   * Historique des connexions (adresse IP, localisation, navigateur, statut).
   * Historique des opérations et modifications effectuées par les utilisateurs.
10. **🎨 Personnalisation Graphique** :
    * Sélecteur de thèmes préconfigurés, mode compact/normal/mini, couleur d'accentuation dynamique.

---

## 🐳 Déploiement Docker (Optionnel)

```bash
# Lancer les conteneurs avec Docker Compose
docker-compose up -d

# Initialiser la base de données dans le conteneur
docker exec -ti dvadmin-django bash
python manage.py makemigrations
python manage.py migrate
python manage.py init_area
python manage.py init
exit
```

---

## 📄 Licence

Ce projet est distribué sous licence **MIT**. Vous êtes libre de l'utiliser, le modifier et le distribuer pour des projets personnels ou commerciaux.

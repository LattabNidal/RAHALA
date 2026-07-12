# 🇩🇿 RAHALA - Dictionnaire Indispensable & Structures de Toutes les Tables Supabase

Ce document contient l'intégralité des spécifications techniques pour l'implémentation de **Supabase** au sein de l'application **RAHALA**. Il détaille minutieusement chaque table, chaque colonne, les types associés, les relations parent-enfant, les triggers d'inscription, ainsi que la modélisation des activités et des options d'utilisateurs.

---

## 🔗 Architecture et Mappage de l'Authentification (Log In / Sign Up)

Supabase intègre son propre schéma d'authentification privé sécurisé (`auth.users`). Lors d'un **Sign Up**, la ligne est stockée dans `auth.users`. Un **Trigger PostgreSQL** copie instantanément les données importantes dans notre table publique de profils (`public.profiles`) pour permettre des associations directes et le stockage d'options avancées (Rôles, Abonnement Premium, etc.).

---

# 📚 Dictionnaire de Données exhaustif

## 1. Table : `public.profiles` (Données Enrichies de l'Utilisateur)
Cette table stocke l'identité publique, le statut de compte et le rôle système (User, Admin).

| Nom de Colonne | Type SQL | Clé | Valeur par défaut | Description / Règle Métier |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `uuid` | **PK**, **FK** | *Aucune* | Référence directement `auth.users(id)` (Suppression en cascade). |
| `fullName` | `text` | - | *'Voyageur'* | Nom complet fourni à l'inscription (Sign Up). |
| `email` | `text` | **Unique**| *Aucune* | Adresse email unique de connexion. |
| `avatarUrl` | `text` | - | *Null* | Lien vers la photo de profil (Unsplash ou hébergée via Supabase Storage). |
| `role` | `public.user_role` | - | `'user'` | Rôle utilisateur : `'user'` (Chauffeurs, Voyageurs) ou `'admin'` (Contrôleurs). |
| `isPremium` | `boolean` | - | `false` | `true` si l'utilisateur possède l'accès illimité GOLD VIP. |
| `premiumUntil` | `timestamptz` | - | *Null* | Date limite de validité de l'accès Premium (facultatif). |
| `createdAt` | `timestamptz` | - | `now()` | Horodatage de création du compte. |
| `updatedAt` | `timestamptz` | - | `now()` | Horodatage de la dernière modification de profil. |

---

## 2. Table : `public.user_settings` (Préférences complexes de l'utilisateur)
Utile pour conserver l'état de l'application et les préférences visuelles ou de navigation du voyageur d'une session à l'autre.

| Nom de Colonne | Type SQL | Clé | Valeur par défaut | Description / Règle Métier |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `uuid` | **PK** | `gen_random_uuid()` | Identifiant unique de ligne. |
| `userId` | `uuid` | **FK** | *Aucune* | Référence `public.profiles(id)` (Suppression en cascade). |
| `preferredLanguage` | `varchar(10)` | - | `'fr'` | Langue de prédilection de l'interface (`'fr'`, `'ar'`, `'en'`). |
| `themeMode` | `varchar(20)` | - | `'dark'` | Thème graphique préféré (`'light'` ou `'dark'`). |
| `enableAudioGuides` | `boolean` | - | `true` | Autorise le préchargement automatique des podcasts du Tassili. |
| `enableSafetyPushes` | `boolean` | - | `true` | Reçoit des alertes de sécurité en temps réel lors des déplacements. |
| `updatedAt` | `timestamptz` | - | `now()` | Dernière sauvegarde des préférences. |

---

## 3. Table : `public.user_activity_logs` (Journal global d'activité)
Enregistre chaque micro-action importante de l'utilisateur à des fins de statistiques (Admin Dashboard) et d'historique personnel.

| Nom de Colonne | Type SQL | Clé | Valeur par défaut | Description / Règle Métier |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `uuid` | **PK** | `gen_random_uuid()` | Identifiant unique de journal. |
| `userId` | `uuid` | **FK** | *Aucune* | Référence `public.profiles(id)` (Optionnel, null si visiteur anonyme). |
| `actionType` | `varchar(100)` | - | *Aucune* | Type d'action : `'LOGIN'`, `'SIGNUP'`, `'BOOKING_CREATED'`, `'AUDIO_PLAYED'`, `'SAFETY_ALERT'`. |
| `description` | `text` | - | *Aucune* | Détail en texte clair pour l'administration (ex: "Connexion réussie depuis Alger"). |
| `ipAddress` | `inet` | - | *Null* | Adresse IP de requête réseau (utilisé pour la détection anti-fraude). |
| `userAgent` | `text` | - | *Null* | Navigateur et OS employé pour accéder au service. |
| `createdAt` | `timestamptz` | - | `now()` | Date et heure précise de l'action. |

---

## 4. Table : `public.heritage_landmarks` (Monuments & Patrimoine National)
Contient l'inventaire enrichi du patrimoine répertorié sur la carte interactive RAHALA.

| Nom de Colonne | Type SQL | Clé | Valeur par défaut | Description / Règle Métier |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `uuid` | **PK** | `gen_random_uuid()` | Identifiant unique du monument géographique. |
| `name` | `varchar(255)`| - | *Aucune* | Nom officiel du monument (ex: "La Casbah d'Alger", "Timgad"). |
| `description` | `text` | - | *Aucune* | Histoire captivante rédigée par des guides professionnels. |
| `category` | `varchar(100)`| - | *Aucune* | Catégorie cible : `'Histoire'`, `'Nature'`, `'Aventure'`, `'Artisanat'`. |
| `region` | `varchar(100)`| - | *Aucune* | Zone d'Algérie concernée : `'Sahara'`, `'Casbah'`, `'Kabylie'`, etc. |
| `latitude` | `double prec.`| - | *Aucune* | Coordonnée de géolocalisation pour le placement précis sur la carte. |
| `longitude`| `double prec.`| - | *Aucune* | Coordonnée de géolocalisation pour le placement précis sur la carte. |
| `imageUrl` | `text` | - | *Null* | Image illustrative ou photo exclusive prise au drone. |
| `audioUrl` | `text` | - | *Null* | Fichier audio du podcast du compagnon de route RAHALA AI. |
| `isGoldExclusive`| `boolean`| - | `false` | Si `true`, le monument et sa visite vocale sont réservés aux VIP. |
| `ratingsAverage`| `numeric(3, 2)`| - | `5.00` | Note moyenne attribuée par les voyageurs. |
| `checkInCount` | `integer` | - | `0` | Nombre total d'enregistrements (visites physiques vérifiées). |
| `createdAt` | `timestamptz` | - | `now()` | Date d'ajout du monument au catalogue. |

---

## 5. Table : `public.user_favorites` (Couplage Voyageurs & Lieux)
Permet à un voyageur de sauvegarder ses monuments préférés pour construire son itinéraire de rêve.

| Nom de Colonne | Type SQL | Clé | Valeur par défaut | Description / Règle Métier |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `uuid` | **PK** | `gen_random_uuid()` | Identifiant unique de favori. |
| `userId` | `uuid` | **FK** | *Aucune* | Référence `public.profiles(id)` (Suppréssion en cascade). |
| `landmarkId` | `uuid` | **FK** | *Aucune* | Référence `public.heritage_landmarks(id)` (Suppression en cascade). |
| `createdAt` | `timestamptz` | - | `now()` | Horodatage d'ajout en favoris. |

*(Contrainte d'unicité : Un couple (userId, landmarkId) doit être strictement unique).*

---

## 6. Table : `public.bookings_hotels` (Réservations d'Hôtels)
Centralise le module d'hébergement hôtelier et résidentiel typique.

| Nom de Colonne | Type SQL | Clé | Valeur par défaut | Description / Règle Métier |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `uuid` | **PK** | `gen_random_uuid()` | Identifiant de commande de chambre. |
| `userId` | `uuid` | **FK** | *Aucune* | Référence `public.profiles(id)`. |
| `hotelName` | `varchar(255)`| - | *Aucune* | Nom de l'établissement hôtelier retenu. |
| `roomType` | `varchar(150)`| - | *Aucune* | Type d'unité (ex: "Suite Impériale Saharienne", "Dortoir Oasis"). |
| `checkInDate` | `date` | - | *Aucune* | Date d'arrivée physique des voyageurs. |
| `checkOutDate` | `date` | - | *Aucune* | Date de libération des couchages. |
| `totalPrice` | `decimal(10, 2)`| - | `0.00` | Montant total en Dinars Algériens (DZD). |
| `guestsCount` | `integer` | - | `1` | Nombre d'occupants prévus de la chambre. |
| `status` | `booking_status`| - | `'pending'` | État de validation : `'pending'`, `'confirmed'`, `'cancelled'`, `'completed'`. |
| `createdAt` | `timestamptz` | - | `now()` | Date exacte d'enregistrement de la demande. |

---

## 7. Table : `public.bookings_flights` (Réservations de Vols)
Centralise le module de billetterie d'itinérance de vol.

| Nom de Colonne | Type SQL | Clé | Valeur par défaut | Description / Règle Métier |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `uuid` | **PK** | `gen_random_uuid()` | Identifiant de commande de vol. |
| `userId` | `uuid` | **FK** | *Aucune* | Référence `public.profiles(id)`. |
| `flightNumber` | `varchar(50)` | - | *Aucune* | Numéro du vol officiel (ex: "AH6120"). |
| `airline` | `varchar(100)`| - | `'Air Algérie'`| Compagnie aérienne partenaire effectuant le trajet. |
| `passengerName`| `varchar(255)`| - | *Aucune* | Nom du passager principal pour l'embarquement. |
| `departureCity`| `varchar(100)`| - | *Aucune* | Ville de départ (ex: "Alger (ALG)"). |
| `arrivalCity` | `varchar(100)`| - | *Aucune* | Destination finale (ex: "Djanet (DJG)"). |
| `departureTime`| `timestamptz` | - | *Aucune* | Date et heure prévue du décollage. |
| `seatNumber` | `varchar(10)` | - | *Null* | Siège assigné dans la cabine (ex: "12A"). |
| `ticketClass` | `varchar(50)` | - | `'Economy'` | Tarification d'embarquement : `'Economy'`, `'Business'`, `'Gold First'`. |
| `price` | `decimal(10, 2)`| - | `0.00` | Montant du billet en Dinars Algériens (DZD). |
| `status` | `booking_status`| - | `'pending'` | État de validation de l'itinéraire de vol. |
| `createdAt` | `timestamptz` | - | `now()` | Date exacte d'enregistrement du titre de transport. |

---

## 8. Table : `public.bookings_taxis` (Chauffeurs VIP & Excursions Rallye)
Stocke le suivi en temps réel des taxis, guides 4x4 du Grand Erg ou chauffeurs privés.

| Nom de Colonne | Type SQL | Clé | Valeur par défaut | Description / Règle Métier |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `uuid` | **PK** | `gen_random_uuid()` | Numéro d'autorisation ou de course. |
| `userId` | `uuid` | **FK** | *Aucune* | Référence `public.profiles(id)`. |
| `driverName` | `varchar(150)`| - | *Null* | Nom d'usage du prestataire assigné. |
| `driverPhone` | `varchar(50)` | - | *Null* | Téléphone de ralliement direct du prestataire. |
| `vehicleInfo` | `varchar(150)`| - | *Null* | Véhicule d'exploitation (ex: "Toyota Land Cruiser 4x4"). |
| `pickupLocation`| `varchar(255)`| - | *Aucune* | Point de ralliement pour l'embarquement. |
| `destination` | `varchar(255)`| - | *Aucune* | Point d'arrivée ou de bivouac. |
| `estimatedPrice`| `decimal(10, 2)`| - | `0.00` | Estimation tarifaire calculée. |
| `pickupTime` | `timestamptz` | - | *Aucune* | Heure de rendez-vous convenue. |
| `status` | `booking_status`| - | `'pending'` | Statut de validation : `'pending'`, `'confirmed'`, `'cancelled'`, `'completed'`. |
| `latitude` | `double prec.`| - | *Null* | latitude actuelle du véhicule connecté. |
| `longitude` | `double prec.`| - | *Null* | longitude actuelle du véhicule connecté. |
| `createdAt` | `timestamptz` | - | `now()` | Heure de validation de l'appel. |

---

## 9. Table : `public.ai_conversations` & `public.ai_messages` (Échange IA)
Pour conserver la mémoire contextuelle à long terme de l'assistant de voyage RAHALA AI.

### Table parent : `public.ai_conversations`
| Nom de Colonne | Type SQL | Clé | Valeur par défaut | Description / Règle Métier |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `uuid` | **PK** | `gen_random_uuid()` | Identifiant de fil de discussion. |
| `userId` | `uuid` | **FK** | *Aucune* | Référence `public.profiles(id)`. |
| `title` | `text` | - | `'Nouvelle ...'` | Titre généré par IA reprenant le thème de l'échange. |
| `createdAt` | `timestamptz` | - | `now()` | Date d'initialisation du fil de discussion. |

### Table enfant : `public.ai_messages`
| Nom de Colonne | Type SQL | Clé | Valeur par défaut | Description / Règle Métier |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `uuid` | **PK** | `gen_random_uuid()` | Identifiant du message. |
| `conversationId`| `uuid` | **FK** | *Aucune* | Référence `public.ai_conversations(id)` en cascade. |
| `sender` | `varchar(10)` | - | *Aucune* | Expéditeur : `'user'` (Le voyageur) ou `'ai'` (Le guide). |
| `messageText` | `text` | - | *Aucune* | Texte du message de dialogue complet. |
| `createdAt` | `timestamptz` | - | `now()` | Heure exacte d'émission du message. |

---

## 10. Table : `public.safety_reports` (Alertes de sécurité Safe Travel)
Centralise les rapports et alertes de sécurité pour les communautés voyageant en zones désertiques ou montagneuses de l'Atlas.

| Nom de Colonne | Type SQL | Clé | Valeur par défaut | Description / Règle Métier |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `uuid` | **PK** | `gen_random_uuid()` | Numéro d'événement officiel. |
| `title` | `varchar(255)`| - | *Aucune* | Description synthétique (ex: "Tempête de sable", "Piste inondée"). |
| `description` | `text` | - | *Aucune* | Explications détaillées sur les précautions à observer. |
| `severity` | `alert_severity`| - | `'low'` | Sévérité : `'low'` (Minime), `'medium'` (Prudence), `'high'` (Danger). |
| `locationName` | `varchar(255)`| - | *Aucune* | Lieu dit (ex: "Parc du Djurdjura", "Col de Chréa"). |
| `latitude` | `double prec.`| - | *Aucune* | Coordonnée cartographique du sinistre ou du point d'alerte. |
| `longitude` | `double prec.`| - | *Aucune* | Coordonnée cartographique du sinistre ou du point d'alerte. |
| `reportedBy` | `uuid` | **FK** | *Null* | Profil de l'utilisateur y ayant contribué (`public.profiles.id`). |
| `status` | `varchar(50)` | - | `'active'` | État du signalement : `'active'`, `'verified'` ou `'archive'`. |
| `createdAt` | `timestamptz` | - | `now()` | Horodatage d'activation de l'incident. |

---

## 11. Table : `public.payments_transactions` (Contrôle des abonnements)
Gère l'historique de facturation sécurisé (liaison possible avec la passerelle Chargily ou CIB nationale).

| Nom de Colonne | Type SQL | Clé | Valeur par défaut | Description / Règle Métier |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `uuid` | **PK** | `gen_random_uuid()` | Identifiant comptable unique. |
| `userId` | `uuid` | **FK** | *Aucune* | Référence de facturation `public.profiles(id)`. |
| `amount` | `decimal(10, 2)`| - | `0.00` | Somme facturée à l'abonné voyageur. |
| `currency` | `varchar(10)` | - | `'DZD'` | Devise de transaction (généralement Dinars Algériens). |
| `paymentProvider`| `varchar(100)`| - | *Aucune* | Opérateur bancaire : `'CIB'`, `'Chargily'`, `'Stripe'`, `'CCP'`. |
| `providerTransactionId`| `varchar(255)`| - | *Null* | ID de confirmation fourni par l'opérateur monétique. |
| `planName` | `varchar(100)`| - | *Aucune* | Formule choisie : `'Rihla Premium'`, `'Tassili Gold Exploration'`. |
| `status` | `transaction_status`| - | `'pending'` | Statut : `'pending'`, `'succeeded'`, `'failed'`, `'refunded'`. |
| `createdAt` | `timestamptz` | - | `now()` | Heure de passation de l'achat ou de la validité. |

---

## 🛡️ Algorithme d'Application Pratique du Role Admin/User

Chaque table sensible (Réservations, Logs, Paiements) est gardée par la technologie **Row Level Security (RLS)** de Supabase. Les requêtes se font en toute sécurité directement depuis le client React :

1. **Un utilisateur lambda (`user`)** ne peut exécuter de requêtes `SELECT`, `UPDATE` ou `INSERT` que sur des lignes dont le champ `userId` correspond à son jeton crypté d'authentification (`auth.uid()`).
2. **Un administrateur (`admin`)** contourne les barrières de ligne si son email ou rôle présent dans `public.profiles` correspond à la valeur `'admin'`. Vous pouvez activer ce droit de contrôle total à l'aide de la règle SQL SQL standard suivante :

```sql
create policy "Les administrateurs ont les droits totaux sur tout"
on public.bookings_hotels
for all
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);
```

Ce dictionnaire complet vous fournit toutes les clés nécessaires pour monter un modèle de données professionnel, robuste et sécurisé, dimensionné à l'échelle du projet national **RAHALA**.

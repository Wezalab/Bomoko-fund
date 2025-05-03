type TranslationRecord = Record<string, string>;

export interface Translations {
  en: TranslationRecord;
  fr: TranslationRecord;
  [key: string]: TranslationRecord;
}

export const translations: Translations = {
  en: {
    // Navbar
    "Login": "Login",
    "Log In": "Log In",
    "Sign Up": "Sign Up", 
    "English": "English",
    "French": "French",
    "Logout": "Logout",
    "Notifications": "Notifications",
    "Projects": "Projects",
    "Profile": "Profile",
    "Settings": "Settings",
    "Change Password": "Change Password",

    // Navigation Items
    "Home": "Home",
    "How it works": "How it works",
    "Contact us": "Contact us",
    "FAQ": "FAQ",
    "Privacy policy": "Privacy policy",

    // HomePage
    "About Us - Bomoko Fund": "About Us - Bomoko Fund",
    "Welcome to": "Welcome to",
    "Bomoko Fund": "Bomoko Fund",
    "Bomoko Fund is a revolutionary": "Bomoko Fund is a revolutionary",
    "crowdfunding platform": "crowdfunding platform",
    "designed to empower": "designed to empower",
    "African entrepreneurs and high-potential business projects.": "African entrepreneurs and high-potential business projects.",
    "We connect": "We connect",
    "visionary business owners": "visionary business owners",
    "with": "with",
    "impact-driven investors and supporters,": "impact-driven investors and supporters,",
    "creating a thriving ecosystem where great ideas receive the funding they deserve.": "creating a thriving ecosystem where great ideas receive the funding they deserve.",
    "Start Now": "Start Now",
    "Projects successfully completed": "Projects successfully completed",
    "Popular projects": "Popular projects",
    "At Bomoko Fund, we prioritize high-potential projects that address critical social and economic needs.": "At Bomoko Fund, we prioritize high-potential projects that address critical social and economic needs.",
    "View all": "View all",
    "Donate": "Donate",

    // Buttons and common actions
    "Submit": "Submit",
    "Cancel": "Cancel",
    "Save": "Save",
    "Edit": "Edit",
    "Delete": "Delete",
    "Continue": "Continue",
    "Back": "Back",
    "Next": "Next",
    "Previous": "Previous",
    "Search": "Search",
    "Filter": "Filter",
    "Sort by": "Sort by",
    "Loading": "Loading",
    "View details": "View details",
    "Learn more": "Learn more",
    
    // Project related
    "Create Project": "Create Project",
    "Edit Project": "Edit Project",
    "Project Details": "Project Details",
    "Project Name": "Project Name",
    "Description": "Description",
    "Target Amount": "Target Amount",
    "Current Amount": "Current Amount",
    "Cashout": "Cashout",
    
    // Auth related
    "Email": "Email",
    "Password": "Password",
    "Forgot Password?": "Forgot Password?",
    "Reset Password": "Reset Password",
    "Confirm Password": "Confirm Password",
    "Don't have an account?": "Don't have an account?",
    "Already have an account?": "Already have an account?",
  },
  fr: {
    // Navbar
    "Login": "Connexion",
    "Log In": "Se connecter",
    "Sign Up": "S'inscrire",
    "English": "Anglais",
    "French": "Français",
    "Logout": "Déconnexion",
    "Notifications": "Notifications",
    "Projects": "Projets",
    "Profile": "Profil",
    "Settings": "Paramètres",
    "Change Password": "Changer le mot de passe",

    // Navigation Items
    "Home": "Accueil",
    "How it works": "Comment ça marche",
    "Contact us": "Contactez-nous",
    "FAQ": "FAQ",
    "Privacy policy": "Politique de confidentialité",

    // HomePage
    "About Us - Bomoko Fund": "À propos de nous - Bomoko Fund",
    "Welcome to": "Bienvenue à",
    "Bomoko Fund": "Bomoko Fund",
    "Bomoko Fund is a revolutionary": "Bomoko Fund est une plateforme révolutionnaire de",
    "crowdfunding platform": "financement participatif",
    "designed to empower": "conçue pour autonomiser",
    "African entrepreneurs and high-potential business projects.": "les entrepreneurs africains et les projets d'entreprise à fort potentiel.",
    "We connect": "Nous connectons",
    "visionary business owners": "des entrepreneurs visionnaires",
    "with": "avec",
    "impact-driven investors and supporters,": "des investisseurs et des soutiens axés sur l'impact,",
    "creating a thriving ecosystem where great ideas receive the funding they deserve.": "créant un écosystème prospère où les grandes idées reçoivent le financement qu'elles méritent.",
    "Start Now": "Commencer maintenant",
    "Projects successfully completed": "Projets réalisés avec succès",
    "Popular projects": "Projets populaires",
    "At Bomoko Fund, we prioritize high-potential projects that address critical social and economic needs.": "Chez Bomoko Fund, nous donnons la priorité aux projets à fort potentiel qui répondent à des besoins sociaux et économiques critiques.",
    "View all": "Voir tout",
    "Donate": "Faire un don",

    // Buttons and common actions
    "Submit": "Soumettre",
    "Cancel": "Annuler",
    "Save": "Enregistrer",
    "Edit": "Modifier",
    "Delete": "Supprimer",
    "Continue": "Continuer",
    "Back": "Retour",
    "Next": "Suivant",
    "Previous": "Précédent",
    "Search": "Rechercher",
    "Filter": "Filtrer",
    "Sort by": "Trier par",
    "Loading": "Chargement",
    "View details": "Voir les détails",
    "Learn more": "En savoir plus",
    
    // Project related
    "Create Project": "Créer un projet",
    "Edit Project": "Modifier le projet",
    "Project Details": "Détails du projet",
    "Project Name": "Nom du projet",
    "Description": "Description",
    "Target Amount": "Montant cible",
    "Current Amount": "Montant actuel",
    "Cashout": "Encaisser",
    
    // Auth related
    "Email": "Email",
    "Password": "Mot de passe",
    "Forgot Password?": "Mot de passe oublié?",
    "Reset Password": "Réinitialiser le mot de passe",
    "Confirm Password": "Confirmer le mot de passe",
    "Don't have an account?": "Vous n'avez pas de compte?",
    "Already have an account?": "Vous avez déjà un compte?",
  }
} 
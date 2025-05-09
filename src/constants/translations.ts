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

    // Testimonials Section
    "Testimonials from Our Community": "Testimonials from Our Community",
    "Hear from entrepreneurs and investors who have transformed lives through Bomoko Fund.": "Hear from entrepreneurs and investors who have transformed lives through Bomoko Fund.",
    "Discover how our platform empowers businesses and drives meaningful impact.": "Discover how our platform empowers businesses and drives meaningful impact.",
    "Be part of the change!": "Be part of the change!",
    "4 Steps": "4 Steps",
    "to get funds for your project": "to get funds for your project",
    "Try it Now": "Try it Now",
    "Next": "Next",

    // How it Works Page
    "How it Works": "How it Works",
    "These steps will guide you through setting up your projects all the way to receiving your donations.": "These steps will guide you through setting up your projects all the way to receiving your donations.",
    "Provide your project information": "Provide your project information",
    "Gather key project details such as the project name, category, type, target donation amount, and other relevant information. This will help define the scope and goals of your project, ensuring potential donors understand the purpose and objectives.": "Gather key project details such as the project name, category, type, target donation amount, and other relevant information. This will help define the scope and goals of your project, ensuring potential donors understand the purpose and objectives.",
    "Submit your project": "Submit your project",
    "After entering your project details, including the name, category, type, and target amount, submit it for review. Our team will carefully assess the information to ensure it meets our guidelines. Once approved, your project will be ready to start receiving donations.": "After entering your project details, including the name, category, type, and target amount, submit it for review. Our team will carefully assess the information to ensure it meets our guidelines. Once approved, your project will be ready to start receiving donations.",
    "Project approval": "Project approval",
    "After our team approves your project, it will be made public, allowing you to start receiving donations.": "After our team approves your project, it will be made public, allowing you to start receiving donations.",
    "Receive your donations": "Receive your donations",
    "You can receive donations through mobile money, credit/debit cards, or even cryptocurrency. This offers flexibility for contributors to choose their preferred method.": "You can receive donations through mobile money, credit/debit cards, or even cryptocurrency. This offers flexibility for contributors to choose their preferred method.",
    "Cash-out your donations": "Cash-out your donations",
    "You can easily cash out your donations whenever you need to, providing you with convenient access to your funds. Our streamlined process ensures that withdrawing your donations is quick and hassle-free.": "You can easily cash out your donations whenever you need to, providing you with convenient access to your funds. Our streamlined process ensures that withdrawing your donations is quick and hassle-free.",

    // Sign In Page
    "Sign into your account": "Sign into your account",
    "Sign in for a better experience": "Sign in for a better experience",
    "Sign in with a phone number": "Sign in with a phone number",
    "Sign in with Google": "Sign in with Google",
    "Sign in with email": "Sign in with email",
    "Don't have an account?": "Don't have an account?",
    "Sign in": "Sign in",
    "Phone Number": "Phone Number",
    "Invalid phone number format. Example: +1 555 123 4567": "Invalid phone number format. Example: +1 555 123 4567",
    "Phone Number is required": "Phone Number is required",
    "Password": "Password",
    "Password is required": "Password is required",
    "Remember me": "Remember me",
    "Forgot Password?": "Forgot Password?",
    "Email": "Email",
    "Email Address": "Email Address",
    "Enter your email": "Enter your email",
    "Email is required": "Email is required",
    "Invalid email address": "Invalid email address",

    // Contact Page
    "Contact us": "Contact us",
    "If you need our help, have questions about how to use the platform or are experiencing technical difficulties, please do not hesitate to contact us.": "If you need our help, have questions about how to use the platform or are experiencing technical difficulties, please do not hesitate to contact us.",
    "Full Names": "Full Names",
    "Type something": "Type something",
    "By submitting this form you agree to our terms and conditions and our Privacy Policy which explains how we may collect, use and disclose your personal information including to third parties.": "By submitting this form you agree to our terms and conditions and our Privacy Policy which explains how we may collect, use and disclose your personal information including to third parties.",
    "Still have questions?": "Still have questions?",
    "If you cannot find answer to your question in our FAQ, you can always contact us. We wil answer to you shortly!": "If you cannot find answer to your question in our FAQ, you can always contact us. We wil answer to you shortly!",
    "We are always happy to help.": "We are always happy to help.",
    "Alternative way to get anwser faster": "Alternative way to get anwser faster",
    "Support 230 children to get school fees": "Support 230 children to get school fees",
    "Email sent successfully!": "Email sent successfully!",
    "Failed to send email. Please try again.": "Failed to send email. Please try again.",

    // NotFound Page
    "404": "404",
    "Page Not Found": "Page Not Found",
    "Sorry, the page you are looking for does not exist or has been moved.": "Sorry, the page you are looking for does not exist or has been moved.",
    "Go Back to Home": "Go Back to Home",

    // Footer
    "Scan to get our App": "Scan to get our App",
    "Download our app to unlock its full potential and enjoy an enhanced experience with Bomoko Fund App, From personalized features to seamless performance": "Download our app to unlock its full potential and enjoy an enhanced experience with Bomoko Fund App, From personalized features to seamless performance",
    "Available on App Store and Play Store": "Available on App Store and Play Store",
    "Contact Info": "Contact Info",
    "Kin Plazza, Patrice Lumumba Avenue, Kinshasa, DRC": "Kin Plazza, Patrice Lumumba Avenue, Kinshasa, DRC",

    // Buttons and common actions
    "Submit": "Submit",
    "Cancel": "Cancel",
    "Save": "Save",
    "Edit": "Edit",
    "Delete": "Delete",
    "Continue": "Continue",
    "Back": "Back",
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
    "Reset Password": "Reset Password",
    "Confirm Password": "Confirm Password",
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

    // Testimonials Section
    "Testimonials from Our Community": "Témoignages de notre communauté",
    "Hear from entrepreneurs and investors who have transformed lives through Bomoko Fund.": "Écoutez les entrepreneurs et investisseurs qui ont transformé des vies grâce à Bomoko Fund.",
    "Discover how our platform empowers businesses and drives meaningful impact.": "Découvrez comment notre plateforme autonomise les entreprises et génère un impact significatif.",
    "Be part of the change!": "Participez au changement !",
    "4 Steps": "4 Étapes",
    "to get funds for your project": "pour obtenir des fonds pour votre projet",
    "Try it Now": "Essayez maintenant",
    "Next": "Suivant",

    // How it Works Page
    "How it Works": "Comment ça marche",
    "These steps will guide you through setting up your projects all the way to receiving your donations.": "Ces étapes vous guideront à travers la configuration de vos projets jusqu'à la réception de vos dons.",
    "Provide your project information": "Fournir les informations de votre projet",
    "Gather key project details such as the project name, category, type, target donation amount, and other relevant information. This will help define the scope and goals of your project, ensuring potential donors understand the purpose and objectives.": "Rassemblez les informations clés du projet comme le nom, la catégorie, le type, le montant cible de don, et autres informations pertinentes. Cela aidera à définir la portée et les objectifs de votre projet, garantissant que les donateurs potentiels comprennent le but et les objectifs.",
    "Submit your project": "Soumettre votre projet",
    "After entering your project details, including the name, category, type, and target amount, submit it for review. Our team will carefully assess the information to ensure it meets our guidelines. Once approved, your project will be ready to start receiving donations.": "Après avoir saisi les détails de votre projet, y compris le nom, la catégorie, le type et le montant cible, soumettez-le pour examen. Notre équipe évaluera soigneusement les informations pour s'assurer qu'elles répondent à nos directives. Une fois approuvé, votre projet sera prêt à commencer à recevoir des dons.",
    "Project approval": "Approbation du projet",
    "After our team approves your project, it will be made public, allowing you to start receiving donations.": "Après l'approbation de votre projet par notre équipe, il sera rendu public, vous permettant de commencer à recevoir des dons.",
    "Receive your donations": "Recevoir vos dons",
    "You can receive donations through mobile money, credit/debit cards, or even cryptocurrency. This offers flexibility for contributors to choose their preferred method.": "Vous pouvez recevoir des dons via mobile money, cartes de crédit/débit, ou même en cryptomonnaie. Cela offre une flexibilité aux contributeurs pour choisir leur méthode préférée.",
    "Cash-out your donations": "Encaisser vos dons",
    "You can easily cash out your donations whenever you need to, providing you with convenient access to your funds. Our streamlined process ensures that withdrawing your donations is quick and hassle-free.": "Vous pouvez facilement encaisser vos dons quand vous en avez besoin, vous offrant un accès pratique à vos fonds. Notre processus simplifié garantit que le retrait de vos dons est rapide et sans tracas.",

    // Sign In Page
    "Sign into your account": "Connectez-vous à votre compte",
    "Sign in for a better experience": "Connectez-vous pour une meilleure expérience",
    "Sign in with a phone number": "Se connecter avec un numéro de téléphone",
    "Sign in with Google": "Se connecter avec Google",
    "Sign in with email": "Se connecter avec un email",
    "Don't have an account?": "Vous n'avez pas de compte?",
    "Sign in": "Se connecter",
    "Phone Number": "Numéro de téléphone",
    "Invalid phone number format. Example: +1 555 123 4567": "Format de numéro de téléphone invalide. Exemple: +1 555 123 4567",
    "Phone Number is required": "Le numéro de téléphone est requis",
    "Password": "Mot de passe",
    "Password is required": "Le mot de passe est requis",
    "Remember me": "Se souvenir de moi",
    "Forgot Password?": "Mot de passe oublié?",
    "Email": "Email",
    "Email Address": "Adresse e-mail",
    "Enter your email": "Entrez votre email",
    "Email is required": "L'email est requis",
    "Invalid email address": "Adresse e-mail invalide",

    // Contact Page
    "Contact us": "Contactez-nous",
    "If you need our help, have questions about how to use the platform or are experiencing technical difficulties, please do not hesitate to contact us.": "Si vous avez besoin de notre aide, si vous avez des questions sur l'utilisation de la plateforme ou si vous rencontrez des difficultés techniques, n'hésitez pas à nous contacter.",
    "Full Names": "Noms complets",
    "Type something": "Écrivez quelque chose",
    "By submitting this form you agree to our terms and conditions and our Privacy Policy which explains how we may collect, use and disclose your personal information including to third parties.": "En soumettant ce formulaire, vous acceptez nos conditions générales et notre politique de confidentialité qui explique comment nous pouvons collecter, utiliser et divulguer vos informations personnelles, y compris à des tiers.",
    "Still have questions?": "Vous avez encore des questions?",
    "If you cannot find answer to your question in our FAQ, you can always contact us. We wil answer to you shortly!": "Si vous ne trouvez pas de réponse à votre question dans notre FAQ, vous pouvez toujours nous contacter. Nous vous répondrons rapidement!",
    "We are always happy to help.": "Nous sommes toujours heureux de vous aider.",
    "Alternative way to get anwser faster": "Autre moyen d'obtenir une réponse plus rapidement",
    "Support 230 children to get school fees": "Soutenir 230 enfants pour obtenir des frais de scolarité",
    "Email sent successfully!": "E-mail envoyé avec succès !",
    "Failed to send email. Please try again.": "Échec de l'envoi de l'e-mail. Veuillez réessayer.",

    // NotFound Page
    "404": "404",
    "Page Not Found": "Page non trouvée",
    "Sorry, the page you are looking for does not exist or has been moved.": "Désolé, la page que vous recherchez n'existe pas ou a été déplacée.",
    "Go Back to Home": "Retour à l'accueil",

    // Footer
    "Scan to get our App": "Scanner pour obtenir notre application",
    "Download our app to unlock its full potential and enjoy an enhanced experience with Bomoko Fund App, From personalized features to seamless performance": "Téléchargez notre application pour débloquer tout son potentiel et profiter d'une expérience améliorée avec l'application Bomoko Fund, des fonctionnalités personnalisées aux performances fluides",
    "Available on App Store and Play Store": "Disponible sur l'App Store et Play Store",
    "Contact Info": "Coordonnées",
    "Kin Plazza, Patrice Lumumba Avenue, Kinshasa, DRC": "Kin Plazza, Avenue Patrice Lumumba, Kinshasa, RDC",

    // Buttons and common actions
    "Submit": "Soumettre",
    "Cancel": "Annuler",
    "Save": "Enregistrer",
    "Edit": "Modifier",
    "Delete": "Supprimer",
    "Continue": "Continuer",
    "Back": "Retour",
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
    "Reset Password": "Réinitialiser le mot de passe",
    "Confirm Password": "Confirmer le mot de passe",
    "Already have an account?": "Vous avez déjà un compte?",
  }
} 
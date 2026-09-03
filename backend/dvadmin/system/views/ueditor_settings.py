from django.conf import settings as gSettings  # Paramètres globaux

# Styles de barre d'outils, possibilité d'ajouter autant de modes que souhaité
toolbars_settings = {
    "besttome": [
        ['source', 'undo', 'redo', 'bold', 'italic', 'underline', 'forecolor', 'backcolor', 'superscript', 'subscript',
         "justifyleft", "justifycenter", "justifyright", "insertorderedlist", "insertunorderedlist", "blockquote",
         'formatmatch', "removeformat", 'autotypeset', 'inserttable', "pasteplain", "wordimage", "searchreplace", "map",
         "preview", "fullscreen"],
        ['insertcode', 'paragraph', "fontfamily", "fontsize", 'link', 'unlink', 'insertimage', 'insertvideo',
         'attachment', 'emotion', "date", "time"]],
    "mini": [['source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'formatmatch', 'autotypeset', '|',
              'forecolor', 'backcolor', '|', 'link', 'unlink', '|', 'simpleupload', 'attachment']],
    "normal": [['source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'removeformat', 'formatmatch',
                'autotypeset', '|', 'forecolor', 'backcolor', '|', 'link', 'unlink', '|', 'simpleupload', 'emotion',
                'attachment', '|', 'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow',
                'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows',
                'splittocols']]
}

# Paramètres Ueditor par défaut, voir ueditor.config.js
ueditor_settings = {
    "toolbars": toolbars_settings["normal"],
    "autoFloatEnabled": False,
    "defaultPathFormat": "%(basename)s_%(datetime)s_%(rnd)s.%(extname)s"  # Convention de nommage par défaut des fichiers téléversés
}
# Voir config.json dans le dossier php pour la configuration
ueditor_upload_settings = {
    # Options de téléversement d'images
    "imageActionName": "uploadimage",  # Nom de l'action d'exécution du téléversement d'images
    "imageMaxSize": 10485760,  # Limite de taille de téléversement, en octets, 10 Mo
    "imageFieldName": "upfile",  # * Nom du champ de formulaire de l'image soumise */
    "imagePathFormat": "",
    "imageInsertAlign": "none",
    "imageAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"],  # Formats d'images autorisés à l'affichage

    # Options de téléversement d'images de gribouillage */
    "scrawlActionName": "uploadscrawl",  # Nom de l'action d'exécution du téléversement de gribouillage */
    "scrawlFieldName": "upfile",  # Nom du champ de formulaire de l'image soumise */
    "scrawlMaxSize": 10485760,  # Limite de taille de téléversement, en octets, 10 Mo
    "scrawlPathFormat": "",
    "scrawlInsertAlign": "none",

    # Téléversement de l'outil de capture d'écran */
    "snapscreenActionName": "uploadimage",  # Nom de l'action d'exécution du téléversement de capture */
    "snapscreenPathFormat": "",
    "snapscreenInsertAlign": "none", # /* Mode de flottement de l'image insérée */

    # Configuration de récupération d'images distantes */
    "catcherLocalDomain": ["127.0.0.1", "localhost", "img.baidu.com"],
    "catcherPathFormat": "",
    "catcherActionName": "catchimage",  # Nom de l'action d'exécution de récupération d'images distantes */
    "catcherFieldName": "source",  # Nom du champ de formulaire de la liste d'images soumise */
    "catcherMaxSize": 10485760,  # Limite de taille de téléversement, en octets */
    "catcherAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"],  # Formats des images récupérées affichés */
    "catcherInsertAlign": "none", # /* Mode de flottement de l'image insérée */
    # Configuration de téléversement vidéo */
    "videoActionName": "uploadvideo",  # Nom de l'action d'exécution du téléversement vidéo */
    "videoPathFormat": "",
    "videoFieldName": "upfile",  # Nom du champ de formulaire vidéo soumis */
    "videoMaxSize": 102400000,  # Limite de taille de téléversement, en octets, 100 Mo par défaut */
    "videoAllowFiles": [
        ".flv", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg",
        ".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid"],  # Formats vidéo autorisés à l'affichage */

    # Configuration de téléversement de fichiers */
    "fileActionName": "uploadfile",  # Dans le controller, nom de l'action d'exécution du téléversement vidéo */
    "filePathFormat": "",
    "fileFieldName": "upfile",  # Nom du champ de formulaire de fichier soumis */
    "fileMaxSize": 204800000,  # Limite de taille de téléversement, en octets, 200 Mo */
    "fileAllowFiles": [
        ".png", ".jpg", ".jpeg", ".gif", ".bmp",
        ".flv", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg",
        ".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid",
        ".rar", ".zip", ".tar", ".gz", ".7z", ".bz2", ".cab", ".iso",
        ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".txt", ".md", ".xml"
    ],  # Formats de fichiers autorisés à l'affichage */

    # Lister les images du répertoire spécifié */
    "imageManagerActionName": "listimage",  # Nom de l'action d'exécution de la gestion d'images */
    "imageManagerListPath": "",
    "imageManagerListSize": 30,  # Nombre de fichiers listés à chaque fois */
    "imageManagerAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"],  # Types de fichiers listés */

    # Lister les fichiers du répertoire spécifié */
    "fileManagerActionName": "listfile",  # Nom de l'action d'exécution de la gestion de fichiers */
    "fileManagerListPath": "",
    "fileManagerListSize": 30,  # Nombre de fichiers listés à chaque fois */
    "fileManagerAllowFiles": [
        ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tif", ".psd"
                                                         ".flv", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg",
        ".mpg",
        ".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid",
        ".rar", ".zip", ".tar", ".gz", ".7z", ".bz2", ".cab", ".iso",
        ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".txt", ".md", ".xml"
    ]  # Types de fichiers listés */
}


# Mise à jour de la configuration : relire UEDITOR_SETTINGS depuis settings.py et écraser les valeurs par défaut
def update_user_settings():
    user_settings = getattr(gSettings, "UEDITOR_SETTINGS", {}).copy()
    if 'config' in user_settings:
        ueditor_settings.update(user_settings["config"])
    if 'upload' in user_settings:
        ueditor_upload_settings.update(user_settings["upload"])


# Lire le fichier Settings utilisateur et écraser la configuration par défaut
update_user_settings()


# Récupérer les paramètres de configuration
def get_ueditor_settings(key, default=None):
    return ueditor_settings.get(key, default)

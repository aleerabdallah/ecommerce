from django.conf import settings




def get_image_storage():
    if settings.ENVIRONMENT == "dev":
        from django.core.files.storage import FileSystemStorage
        return FileSystemStorage()
    else:
        from cloudinary_storage.storage import MediaCloudinaryStorage
        return MediaCloudinaryStorage()





def get_object_or_none(model, **kwargs):
    try:
        obj = model.objects.get(**kwargs)
        return obj
    except Exception as e:
        return None
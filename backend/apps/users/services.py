from .models import UserAccount, Address
from common.utils import get_object_or_none


def get_user_by_email(email: str, model=UserAccount) -> UserAccount:
    user = get_object_or_none(email=email, model=UserAccount)
    return user


def create_address(user: UserAccount, model = Address):
    model.objects.create(user=user)

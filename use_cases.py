from typing import Optional
from domain import User
from ports import UserUseCasePort, UserRepositoryPort

class UserUseCase(UserUseCasePort):
    def __init__(self, repo: UserRepositoryPort):
        self.repo = repo 

    def get_user_info(self, user_id: int) -> Optional[User]:
        if user_id <= 0:
            return None
        return self.repo.get_user_by_id(user_id)
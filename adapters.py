from typing import Optional
from domain import User
from ports import UserRepositoryPort

# Secondary Adapter: A simulated in-memory database
class InMemoryUserRepository(UserRepositoryPort):
    def __init__(self):
        self.users = {
            1: User(id=1, name="Arisha", role="RippIntern"),
            2: User(id=2, name="Rippling", role="Admin")
        }

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        return self.users.get(user_id)
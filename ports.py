from abc import ABC, abstractmethod
from typing import Optional
from domain import User

# Secondary Port (Driven): How the app talks to a database
class UserRepositoryPort(ABC):
    @abstractmethod
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        pass

# Primary Port (Driving): How the outside world talks to the app
class UserUseCasePort(ABC):
    @abstractmethod
    def get_user_info(self, user_id: int) -> Optional[User]:
        pass
from fastapi import FastAPI, HTTPException
from adapters import InMemoryUserRepository
from use_cases import UserUseCase

app = FastAPI()

user_repo = InMemoryUserRepository()
user_service = UserUseCase(user_repo)

# Primary Adapter: REST API Route
@app.get("/users/{user_id}")
def get_user(user_id: int):

    user = user_service.get_user_info(user_id)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "status": "success",
        "data": user
    }
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from adapters import InMemoryUserRepository
from use_cases import UserUseCase

app = FastAPI()

user_repo = InMemoryUserRepository()
user_service = UserUseCase(user_repo)

class UserResponse(BaseModel):
    id: int
    name: str
    role: str

class GetUserResponse(BaseModel):
    status: str
    data: UserResponse


@app.get("/users/{user_id}", response_model=GetUserResponse)
def get_user(user_id: int):
    try:
        user = user_service.get_user_info(user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "status": "success",
        "data": user
    }
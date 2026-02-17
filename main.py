from fastapi import FastAPI, HTTPException
from adapters import InMemoryUserRepository
from use_cases import UserUseCase

app = FastAPI()

user_repo = InMemoryUserRepository()
user_service = UserUseCase(user_repo)

# Primary Adapter: REST API Route
@app.get("/users/{user_id}")
def get_user(user_id: int):
    try:
        user = user_service.get_user_info(user_id)
    except ValueError as e:
        # Catch the bad input and return a 400 error
        raise HTTPException(status_code=400, detail=str(e))
        
    if not user:
        # If it's valid but just not in the DB, return 404
        raise HTTPException(status_code=404, detail="User not found")
        
    return {
        "status": "success",
        "data": user
    }
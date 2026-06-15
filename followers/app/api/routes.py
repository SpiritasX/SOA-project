# app/api/routes.py
from fastapi import APIRouter, Header, HTTPException
from app.services.follow_service import FollowService

router = APIRouter(prefix="/api/followers")

@router.get("/{user_id}/status")
def status(
        user_id: int,
        x_user_id: str = Header(None)
):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Missing user header")

    follower_id = int(x_user_id)

    return {"following": FollowService.is_following(follower_id, user_id)}

@router.post("/{user_id}/follow")
def follow(
        user_id: int,
        x_user_id: str = Header(None)
):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Missing user header")

    follower_id = int(x_user_id)

    if follower_id == user_id:
        raise HTTPException(status_code=403, detail="You can't follow yourself")

    FollowService.follow(follower_id, user_id)
    return {"message": "Followed"}

@router.post("/{user_id}/unfollow")
def unfollow(
        user_id: int,
        x_user_id: str = Header(None)
):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Missing user header")

    follower_id = int(x_user_id)

    FollowService.unfollow(follower_id, user_id)
    return {"message": "Unfollowed"}

@router.get("/me")
def get_my_following(x_user_id: str = Header(None)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Missing user header")

    user_id = int(x_user_id)

    return {"following_user_ids": FollowService.get_following(user_id)}

@router.get("/recommendations")
def get_recommendations(x_user_id: str = Header(None)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Missing user header")

    user_id = int(x_user_id)

    return {"recommended_user_ids": FollowService.get_follow_recommendations(user_id)}
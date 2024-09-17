import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui";
import { useFollowUser, useUnfollowUser } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";

interface FollowButtonProps {
  userId: string;
  initialIsFollowing: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId, initialIsFollowing, onFollowChange }) => {
  const { user } = useUserContext();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleFollow = () => {
    followUser.mutate(
      { userId, followerId: user.id },
      {
        onSuccess: () => {
          setIsFollowing(true);
          if (onFollowChange) onFollowChange(true);
        },
        onError: (error) => {
          console.error("Error following user:", error);
        },
      }
    );
  };

  const handleUnfollow = () => {
    unfollowUser.mutate(
      { userId, followerId: user.id },
      {
        onSuccess: () => {
          setIsFollowing(false);
          if (onFollowChange) onFollowChange(false);
        },
        onError: (error) => {
          console.error("Error unfollowing user:", error);
        },
      }
    );
  };

  // Condicional para ocultar el botón si el usuario es el mismo
  if (user.id === userId) {
    return null;
  }

  return (
    <Button
      type="button"
      className="shad-button_primary px-8"
      onClick={isFollowing ? handleUnfollow : handleFollow}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
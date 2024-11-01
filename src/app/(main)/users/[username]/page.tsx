import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowerCount";
import TrendsSideBar from "@/components/TrendsSideBar";
import UserAvatar from "@/components/UserAvatar";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import UserPosts from "./UserPosts";
import Linkify from "@/components/Linkify";
import EditProfileButton from "./EditProfileButton";

interface PageProps {
  params: { username: string };
}

// Cached fetch function for user data
const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();
  return user;
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function Page({ params }: PageProps) {
  const { username } = await params;
  const { user: loggedinUser } = await validateRequest();

  if (!loggedinUser) {
    return (
      <p className="text-destructive">
        You&apst;re not authorized to view this page.
      </p>
    );
  }

  const user = await getUser(username, loggedinUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedinUserId={loggedinUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.id === loggedinUser.id
              ? "Your posts"
              : `${user.displayName}'s posts`}
          </h2>
        </div>
        <UserPosts userId={user.id} />
      </div>
      <TrendsSideBar />
    </main>
  );
}
interface UserProfileProps {
  user: UserData;
  loggedinUserId: string;
}
// Updated UserProfile component as synchronous for easier rendering
function UserProfile({ user, loggedinUserId }: UserProfileProps) {
  const FollowerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedinUserId,
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            {user.username.toLowerCase() === "amr" && (
              <>
                
              </>
            )}
          </div>
          <div className="text-muted-foreground">@{user.username}</div>
          <div>Member since {formatDate(user.createdAt, "MMM d, yyyy")}</div>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={FollowerInfo} />
          </div>
        </div>
        {user.id === loggedinUserId ? (
          <EditProfileButton user={user} />
        ) : (
          <FollowButton userId={user.id} initialState={FollowerInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
    </div>
  );
}

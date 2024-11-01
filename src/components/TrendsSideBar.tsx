import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { formatNumber } from "@/lib/utils";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import FollowButton from "./FollowButton";
import { getUserDataSelect } from "@/lib/types";
import UserTooltip from "./UserTooltip";

export default function TrendsSideBar() {
  return (
    <div className="lg:w-70 sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block">
      <Suspense fallback={<SidebarLoadingSkeleton />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
}

function SidebarLoadingSkeleton() {
  return (
    <div className="space-y-5">
      <SectionLoadingSkeleton />
      <TrendingTopicsLoadingSkeleton />
    </div>
  );
}

function SectionLoadingSkeleton() {
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <Skeleton className="h-6 w-32 rounded" />
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-12 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          </div>
          <Skeleton className="h-8 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}

function TrendingTopicsLoadingSkeleton() {
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <Skeleton className="h-6 w-32 rounded" /> {/* "Trending topics" title */}
      <div className="space-y-3">
        {/* Repeat this block for each loading hashtag */}
        <div>
          <Skeleton className="h-4 w-40 rounded" /> {/* Hashtag */}
          <Skeleton className="mt-1 h-4 w-20 rounded" /> {/* Post count */}
        </div>
        <div>
          <Skeleton className="h-4 w-40 rounded" /> {/* Hashtag */}
          <Skeleton className="mt-1 h-4 w-20 rounded" /> {/* Post count */}
        </div>
        <div>
          <Skeleton className="h-4 w-40 rounded" /> {/* Hashtag */}
          <Skeleton className="mt-1 h-4 w-20 rounded" /> {/* Post count */}
        </div>
        <div>
          <Skeleton className="h-4 w-40 rounded" /> {/* Hashtag */}
          <Skeleton className="mt-1 h-4 w-20 rounded" /> {/* Post count */}
        </div>
        <div>
          <Skeleton className="h-4 w-40 rounded" /> {/* Hashtag */}
          <Skeleton className="mt-1 h-4 w-20 rounded" /> {/* Post count */}
        </div>
      </div>
    </div>
  );
}

async function WhoToFollow() {
  const { user } = await validateRequest();
  if (!user) return null;
  await new Promise((resolve) => setTimeout(resolve, 10000));
  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who to follow</div>
      {usersToFollow.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <UserTooltip user={user}>
            <Link
              href={`/users/${user.username}`}
              className="flex items-center gap-3"
            >
              <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
              <div>
                <p className="line-clamp-1 break-all font-semibold hover:underline">
                  {user.displayName}
                </p>
                <p className="line-clamp-1 break-all text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </Link>
          </UserTooltip>
          <FollowButton
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: user.followers.some(
                ({ followerId }) => followerId === user.id,
              ),
            }}
          />
        </div>
      ))}
    </div>
  );
}

const getTrendingTopics = unstable_cache(
  async () => {
const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
  SELECT LOWER(unnest(regexp_matches(content, '#[\\u0600-\\u06FF\\w_]+', 'g'))) AS hashtag, COUNT(*) AS count
  FROM posts
  GROUP BY (hashtag)
  ORDER BY count DESC, hashtag ASC
  LIMIT 5
`;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  {
    revalidate: 3 * 60 * 60,
  },
);

async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Trending topics</div>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.split("#")[1];

        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

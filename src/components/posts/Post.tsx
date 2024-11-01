"use client";

import { PostData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { formatRelativeData } from "@/lib/utils";
import { useSession } from "@/app/(main)/SessionProvider";
import PostMoreButton from "./PostMoreButton";
import Linkify from "../Linkify";
import Image from "next/image";
import UserTooltip from "../UserTooltip";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl} />
            </Link>
          </UserTooltip>
          <div>
            <div className="flex items-center space-x-1">
              <UserTooltip user={post.user}>
                <Link
                  href={`/users/${post.user.username}`}
                  className="font-medium hover:underline"
                >
                  {post.user.displayName}
                </Link>
              </UserTooltip>

              {post.user.username.toLowerCase() === "amr" && (
                <div className="flex items-center space-x-1">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Twitter_Verified_Badge.svg"
                    alt="Verified"
                    className="h-6 w-6"
                    width={24}
                    height={24}
                  />
                  <Image
                    src="https://cdn3.emoji.gg/emojis/9385-owner.png"
                    alt="Crown"
                    className="h-6 w-6"
                    width={24}
                    height={24}
                  />
                </div>
              )}
            </div>

            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
            >
              {formatRelativeData(new Date(post.createdAt))}
            </Link>
          </div>
        </div>
        {post.user.id === user.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
    </article>
  );
}

import Link from "next/link";
import { LinkIt, LinkItUrl } from "react-linkify-it";
import UserLinkWithToolTip from "./UserLinkWithToolTip";

interface LinkifyProps {
  children: React.ReactNode;
}

export default function Linkify({ children }: LinkifyProps) {
  return (
    <LinkifyUsername>
      <LinkifyHashtag>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyHashtag>
    </LinkifyUsername>
  );
}

function LinkifyUrl({ children }: LinkifyProps) {
  return (
    <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
  );
}

function LinkifyUsername({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/(@[a-zA-Z0-9\u0600-\u06FF_-]+)/}
      component={(match, key) => {
        const username = match.slice(1);
        return (
          <UserLinkWithToolTip username={username} key={key}>
              {match}
          </UserLinkWithToolTip>
        );
      }}
    >
      {children}
    </LinkIt>
  );
}

function LinkifyHashtag({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/(#[a-zA-Z0-9\u0600-\u06FF_-]+)/}
      component={(match, key) => {
        const hashtag = match.slice(1);
        return (
          <Link
            key={key}
            href={`/hashtag/${hashtag}`}
            className="text-primary hover:underline"
          >
            {match}
          </Link>
        );
      }}
    >
      {children}
    </LinkIt>
  );
}

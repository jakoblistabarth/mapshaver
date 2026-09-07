import Link from "next/link";
import { RiGithubLine } from "react-icons/ri";
import Button from "./Button";

const Footer = () => {
  return (
    <>
      <footer className="bg-white p-3">
        <div className="flex gap-5">
          <Link href={"/about"}>About</Link>
          <div className="flex grow justify-end">
            <Link
              className="flex items-center"
              href={"https://github.com/jakoblistabarth/mapshaver"}
              aria-label="GitHub Repository"
            >
              <Button variant="ghost">
                <RiGithubLine />
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

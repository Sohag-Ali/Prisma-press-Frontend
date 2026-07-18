import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      Main Page

      blog page : <Link href="/blogs">Blogs</Link>
    </div>
  );
}

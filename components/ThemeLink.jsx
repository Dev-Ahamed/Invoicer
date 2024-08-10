import Link from "next/link";
import React from "react";

const ThemeLink = ({ className = "", href = "#", title = "Default Title" }) => {
  return (
    <Link href={href} className={className}>
      {title}
    </Link>
  );
};

export default ThemeLink;

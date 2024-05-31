"use client";
import { Drawer, Slide } from "@mui/material";
import Link from "next/link";
import React from "react";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { usePathname } from "next/navigation";
import useUpdateEffect from "@/hooks/useUpdateEffect";

const RightNav = () => {
  const pathName = usePathname()
  const [showMobileNav, setshowMobileNav] = React.useState(false);

  const handleshowMobileNav = () => {
    setshowMobileNav(!showMobileNav);
  };

  // Close the Navbar when the user routes to different page
  useUpdateEffect(() => {
    setshowMobileNav(false)
  } ,[pathName])

  return (
    <div>
      <div className="menu-icon" onClick={handleshowMobileNav}>
        <MenuRoundedIcon sx={{ color: 'white', fontSize: '40px'}} />
      </div>

        <Drawer
          anchor="right"
          open={showMobileNav}
          PaperProps={{
            sx: {
              width: { lg: "600px", sm: "80%", xs: "80%" },
              padding: "20px",
              backgroundColor: "#0D0E12",
            },
          }}
          onClose={() => setshowMobileNav(false)}
        >
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/blogs">Blogs</Link>
              </li>
              <li>
                <Link href="/projects">Projects</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/contact-us">Contact</Link>
              </li>
            </ul>
        </Drawer>

      <div className={`nav-elements ${showMobileNav && ""}`}>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/blogs">Blogs</Link>
          </li>
          <li>
            <Link href="/projects">Projects</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact-us">Contact</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RightNav;

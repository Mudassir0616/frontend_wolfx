"use client";
import { Box, IconButton } from "@mui/material";
import "../../../globalStyles/global.css";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import {
  ForkLeftRounded,
  ForkRightRounded,
  HomeMaxRounded,
  PagesRounded,
  Person2Rounded,
} from "@mui/icons-material";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import { useEffect, useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";

export default function SideNav() {
  const is_mobile = useMediaQuery("(max-width: 750px)");
  const [collapsed, setCollapsed] = useState(true);
  const [toggled, setToggled] = useState(true);

  const handleCollapsedChange = () => {
    // if(is_mobile) return;
    setCollapsed(!collapsed);
  };

  const handleToggleSidebar = () => {
    setToggled(!toggled);
  };

  useEffect(() => {
    setToggled(true)
  } ,[is_mobile])

  return (
    <>
      <IconButton
        onClick={handleToggleSidebar}
        style={{
          display: is_mobile ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 1000,
          backgroundColor: "white",
          width: '30px',
          height: '30px',
          borderRadius: "99px",
        }}
      >
        <DensityMediumIcon sx={{ fontSize: '18px'}}/>
      </IconButton>
      <Sidebar
        className={`app ${toggled ? "toggled" : ""}`}
        collapsed={collapsed}
        toggled={toggled}
        onToggle={handleToggleSidebar}
        breakPoint="md"
      >
        <main style={{ marginTop: is_mobile && "60px"}}>
          <Menu>
            {collapsed ? (
              <MenuItem
                icon={<ForkRightRounded />}
                onClick={handleCollapsedChange}
              ></MenuItem>
            ) : (
              <MenuItem
                suffix={<ForkLeftRounded />}
                onClick={handleCollapsedChange}
                
              >
                <div
                  style={{
                    padding: "9px",
                    fontWeight: "bold",
                    fontSize: 14,
                    letterSpacing: "1px",
                  }}
                >
                  YOUR LOGO!..
                </div>
              </MenuItem>
            )}
            <hr />
          </Menu>

          <Menu>
            <MenuItem href="/" icon={<HomeMaxRounded />}>Dashboard</MenuItem>
            <MenuItem href="/about" icon={<PagesRounded />}>
              About
            </MenuItem>
            <SubMenu defaultOpen label={"Professors"} icon={<Person2Rounded />}>
              <MenuItem icon={<Person2Rounded />}>Ex Professors</MenuItem>
              <MenuItem icon={<Person2Rounded />}>Probation Period</MenuItem>
            </SubMenu>
          </Menu>
        </main>
      </Sidebar>
    </>
  );
}

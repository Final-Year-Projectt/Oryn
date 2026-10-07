import { useEffect, useRef, useState } from "react";
import { Container, Nav, Navbar as BsNavbar } from "react-bootstrap";
import { GiKnockedOutStars } from "react-icons/gi";
import { FiMenu, FiX } from "react-icons/fi";

function Navbar() {

    const [expanded, setExpanded] = useState(false);
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <BsNavbar
  ref={navbarRef}
  expanded={expanded}
  onToggle={setExpanded}
  expand="lg"
  className="border-bottom border-gray-300 oryn-navbar"
>
      <Container fluid className="px-4 px-lg-5">
        <BsNavbar.Brand
  href="/"
  className="d-flex align-items-center gap-2 fw-bold fs-5"
>
  <GiKnockedOutStars size={30} color="#0D9488" />
  ORYN
</BsNavbar.Brand>

    <BsNavbar.Toggle
  aria-controls="oryn-navbar"
  aria-label="Toggle navigation"
>
  {expanded ? <FiX size={28} /> : <FiMenu size={28} />}
</BsNavbar.Toggle>

        <BsNavbar.Collapse id="oryn-navbar">
          <Nav className="ms-auto align-items-lg-center gap-lg-4">
           <Nav.Link
  href="#features"
  className="oryn-nav-link"
  onClick={() => setExpanded(false)}
>
  Features
</Nav.Link>
           <Nav.Link
  href="#workflow"
  className="oryn-nav-link"
  onClick={() => setExpanded(false)}
>
  How It Works
</Nav.Link>
          <Nav.Link
  href="/login"
  className="oryn-nav-link border border-secondary rounded px-3"
  onClick={() => setExpanded(false)}
>
  Login
</Nav.Link>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}

export default Navbar;
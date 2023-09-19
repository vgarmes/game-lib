const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="flex h-28 w-full items-end p-3 justify-center text-sm font-semibold">
      &copy; {currentYear} Victor Garcia Mestre
    </footer>
  );
};

export default Footer;

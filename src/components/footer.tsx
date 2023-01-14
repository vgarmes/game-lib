const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="flex h-28 w-full items-center justify-center bg-gradient-to-b from-slate-100 to-slate-300 text-sm font-semibold dark:from-gray-900 dark:to-gray-800">
      &copy; {currentYear} Victor Garcia Mestre
    </footer>
  );
};

export default Footer;

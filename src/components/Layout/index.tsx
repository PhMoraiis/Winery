import { Footer } from "../Footer";
import { Header } from "../Header";

type Props = { children: React.ReactNode };

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="bg-[#F6f6f6] max-w-screen-[1400px]">
      <Header />
        <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
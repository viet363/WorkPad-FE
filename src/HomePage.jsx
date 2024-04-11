import { Route, Routes } from "react-router-dom";
import CrossBar from "./MenuBar/CrossBar";
import Document from "./Compoment/Document.jsx";
import SignIn from "./Compoment/SignIn.jsx";
import MainPage from "./Compoment/PageMain.jsx";
import Footer from "./Compoment/Footer.jsx";
import NoteEdit from "./Compoment/NoteEdit.jsx";
import Account from "./Compoment/Account.jsx";
import { useContext } from "react";
import { StatusContext } from "./Context/Status.jsx";
import SignUp from "./Compoment/SignUp.jsx";

export default function HomePage() {
  const [, , isSideBar] = useContext(StatusContext);
  return (
    <div>
      <div
        className={isSideBar.Sidebar ? "fixed w-full" : "fixed w-full hidden"}
      >
        <CrossBar />
      </div>
      <div>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/Document" element={<Document />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/NoteEdit" element={<NoteEdit />} />
          <Route path="/Account" element={<Account />} />
        </Routes>
      </div>
      {isSideBar.Footer ? (
        <footer className="w-full">
          <Footer />
        </footer>
      ) : (
        <div></div>
      )}
    </div>
  );
}
import React, { useContext, useEffect, useState } from "react";
import { StatusContext } from "../Context/Status";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

export default function NoteEdit() {
  const [, , , SetIsSideBar, Account] = useContext(StatusContext);
  const [StorageNote, setStorageNote] = useState([]);
  const [DataNote, setDataNote] = useState({
    _id: "",
    Title: "",
    Prioritize: 0,
    DateCreate: "",
    EmailCreate: "",
    Content: "",
  });
  const [ContentNote, setContentNote] = useState("");
  const [SearchNote, setSearchNote] = useState([]);
  const [Search, setSearch] = useState("");
  const [isWait, setIsWait] = useState(false);
  const [ResultStatus, setResultStatus] = useState({ Status: "" });

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    ["link", "image", "video", "formula"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ];

  const modules = {
    toolbar: toolbarOptions,
  };

  useEffect(() => {
    setTimeout(() => {
      if (Account.Email === "" || Account.Email === undefined) {
        setDataNote({ ...DataNote, Content: ContentNote });
        setStorageNote((prev) =>
          prev.map((i) =>
            i._id === DataNote._id ? { ...i, Content: ContentNote } : i
          )
        );
      } else {
        setDataNote({ ...DataNote, Content: ContentNote });
        axios
          .post("http://localhost:9000/Note/ChangeContent", {
            _id: DataNote._id,
            Content: ContentNote,
          })
          .then(() => {
            axios
              .post("http://localhost:9000/Note/GetNoteByEmail", {
                Email: Account.Email,
              })
              .then((rs) => {
                setResultStatus({ Status: rs.data.Status });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContentNote]);

  const ChangeTitle = (e) => {
    const { name, value } = e.target;
    setDataNote({ ...DataNote, [name]: value });
    setStorageNote((prev) =>
      prev.map((i) => (i._id === DataNote._id ? { ...i, Title: value } : i))
    );
  };

  const ChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const GetDay = () => {
    const DateTime = new Date();
    const Ngay = DateTime.getDate();
    const Thang = DateTime.getMonth();
    const Nam = DateTime.getFullYear();
    return Ngay + "/" + Thang + "/" + Nam;
  };

  const AddNote = () => {
    if (Account.Email === "" || Account.Email === undefined) {
      const NewNote = {
        _id: (Math.floor(Math.random() * 900000) + 100000).toString(),
        DateCreate: GetDay(),
        Title: "New Note",
        Prioritize: 0,
        EmailCreate: "",
        Content: "",
      };
      setDataNote(NewNote);
      setContentNote(NewNote.Content);
      setStorageNote([...StorageNote, NewNote]);
    } else {
      axios
        .post("http://localhost:9000/Note/SaveNote", {
          Email: Account.Email,
          Content: "",
          Title: "New Note",
        })
        .then((rs) => {
          setResultStatus({ Status: rs.data.Status });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const SelectNote = (ID) => {
    const NoteByID = StorageNote.find((A) => A._id === ID);
    setDataNote(NoteByID);
    setContentNote(NoteByID.Content);
  };

  const AutoDeleteSearchNote = () => {
    const ExistsSearchNote = SearchNote.filter((i) => i._id !== DataNote._id);
    setSearchNote(ExistsSearchNote);
    axios
      .post("http://localhost:9000/Note/DeleteNote", { _id: DataNote._id })
      .then((rs) => {
        setResultStatus({ Status: rs.data.Status });
        if (ExistsSearchNote.length >= 1) {
          if (ExistsSearchNote[0]._id === DataNote._id) {
            setDataNote(ExistsSearchNote[1]);
            setContentNote(ExistsSearchNote[1].Content);
          } else {
            setDataNote(ExistsSearchNote[0]);
            setContentNote(ExistsSearchNote[0].Content);
          }
        } else {
          setDataNote({
            _id: "",
            Title: "",
            Prioritize: 0,
            DateCreate: "",
            EmailCreate: "",
            Content: "",
          });
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const DeleteNote = () => {
    if (!Account.Email) {
      const ExistsNote = StorageNote.filter((i) => i._id !== DataNote._id);
      if (ExistsNote.length === 0) {
        window.localStorage.setItem("Notes", "");
        setStorageNote(ExistsNote);
      } else {
        setStorageNote(ExistsNote);
      }
      if (SearchNote.length >= 1) {
        AutoDeleteSearchNote();
      }
      if (StorageNote.length > 1) {
        if (StorageNote[0]._id === DataNote._id) {
          setDataNote(StorageNote[1]);
          setContentNote(StorageNote[1].Content);
        } else {
          setDataNote(StorageNote[0]);
          setContentNote(StorageNote[0].Content);
        }
      } else {
        setDataNote({
          _id: "",
          Title: "",
          Prioritize: 0,
          DateCreate: "",
          EmailCreate: "",
          Content: "",
        });
        window.location.reload();
      }
    } else {
      axios
        .post("http://localhost:9000/Note/DeleteNote", { _id: DataNote._id })
        .then((rs) => {
          if (SearchNote.length >= 1) {
            AutoDeleteSearchNote();
          }
          setResultStatus({ Status: rs.data.Status });
          if (StorageNote.length >= 1) {
            if (StorageNote[0]._id === DataNote._id) {
              setDataNote(StorageNote[1]);
              setContentNote(StorageNote[1].Content);
            } else {
              setDataNote(StorageNote[0]);
              setContentNote(StorageNote[0].Content);
            }
          } else {
            setDataNote({
              _id: "",
              Title: "",
              Prioritize: 0,
              DateCreate: "",
              EmailCreate: "",
              Content: "",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const HandleSearch = (e) => {
    e.preventDefault();
    const StringSearch = new RegExp(Search, "i");
    setSearchNote(() => {
      return StorageNote.filter((i) => StringSearch.test(i.Title));
    });
  };

  const ChangePrioritize = () => {
    if (!Account.Email) {
      if (DataNote.Prioritize === 0) {
        setDataNote({ ...DataNote, Prioritize: 1 });
        setStorageNote((prev) =>
          prev.map((i) =>
            i._id === DataNote._id ? { ...i, Prioritize: 1 } : i
          )
        );
      } else {
        setDataNote({ ...DataNote, Prioritize: 0 });
        setStorageNote((prev) =>
          prev.map((i) =>
            i._id === DataNote._id ? { ...i, Prioritize: 0 } : i
          )
        );
      }
      setIsWait(true);
    } else {
      if (DataNote.Prioritize === 0) {
        axios
          .post("http://localhost:9000/Note/ChangePrioritize", {
            _id: DataNote._id,
            Prioritize: 1,
          })
          .then((rs) => {
            setDataNote({ ...DataNote, Prioritize: 1 });
            setResultStatus({ Status: rs.data.Status });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        axios
          .post("http://localhost:9000/Note/ChangePrioritize", {
            _id: DataNote._id,
            Prioritize: 0,
          })
          .then((rs) => {
            setDataNote({ ...DataNote, Prioritize: 0 });
            setResultStatus({ Status: rs.data.Status });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  useEffect(() => {
    setIsWait(true);
    if (Account.Email === "" || Account.Email === undefined) {
      if (window.localStorage.getItem("Notes")) {
        const Notes = JSON.parse(window.localStorage.getItem("Notes"));
        if (Notes) {
          setStorageNote(() => {
            return Notes.sort((a, b) => b.Prioritize - a.Prioritize);
          });
        }
      }
    } else {
      if (window.localStorage.getItem("Notes")) {
        const Notes = JSON.parse(window.localStorage.getItem("Notes"));
        if (Notes) {
          Notes.forEach((i) => {
            axios
              .post("http://localhost:9000/Note/SaveNote", {
                Email: Account.Email,
                Content: i.Content,
                Title: i.Title,
              })
              .then((rs) => {
                setResultStatus({ Status: rs.data.Status });
                setIsWait(true);
              })
              .catch((err) => {
                console.log(err);
              });
          });
          axios
            .post("http://localhost:9000/Note/GetNoteByEmail", {
              Email: Account.Email,
            })
            .then((rs) => {
              setStorageNote(
                rs.data.sort((a, b) => b.Prioritize - a.Prioritize)
              );
              window.localStorage.setItem("Notes", "");
              setIsWait(true);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else {
        axios
          .post("http://localhost:9000/Note/GetNoteByEmail", {
            Email: Account.Email,
          })
          .then((rs) => {
            setStorageNote(rs.data.sort((a, b) => b.Prioritize - a.Prioritize));
            setIsWait(true);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Account]);

  useEffect(() => {
    if (StorageNote.length > 0) {
      setStorageNote(() => {
        return StorageNote.sort((a, b) => b.Prioritize - a.Prioritize);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DataNote.Prioritize]);

  useEffect(() => {
    setTimeout(() => {
      setIsWait(false);
    }, 2000);
  }, [isWait]);

  useEffect(() => {
    if (Account.Email) {
      if (DataNote._id) {
        setTimeout(() => {
          axios
            .post("http://localhost:9000/Note/ChangeTitle", {
              _id: DataNote._id,
              Title: DataNote.Title,
            })
            .then(() => {
              axios
                .post("http://localhost:9000/Note/GetNoteByEmail", {
                  Email: Account.Email,
                })
                .then((rs) => {
                  setResultStatus({ Status: rs.data.Status });
                })
                .catch((err) => {
                  console.log(err);
                });
            });
        }, 1500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DataNote.Title]);

  useEffect(() => {
    const StringSearch = new RegExp(Search, "i");
    setSearchNote(() => {
      return StorageNote.filter((i) => StringSearch.test(i.Title));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Search]);

  useEffect(() => {
    if (Account.Email === "" || Account.Email === undefined) {
      if (StorageNote.length !== 0) {
        window.localStorage.setItem("Notes", JSON.stringify(StorageNote));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [StorageNote]);

  useEffect(() => {
    SetIsSideBar({ Sidebar: false, Footer: false });
  }, [SetIsSideBar]);

  useEffect(() => {
    if (ResultStatus.Status === "Success") {
      axios
        .post("http://localhost:9000/Note/GetNoteByEmail", {
          Email: Account.Email,
        })
        .then((rs) => {
          setStorageNote(rs.data.sort((a, b) => b.Prioritize - a.Prioritize));
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ResultStatus]);

  return (
    <div>
      <div className="fixed w-[250px] bg-[#ffeaaa] h-full">
        <div className="flex flex-col">
          <div className="w-full bg-[#d9d9d9]">
            <Link to="/">
              <img
                className="w-[50px] bg-[#eee] p-3"
                src="./Icon/arrow-left-solid.svg"
                alt=""
              ></img>
            </Link>
          </div>
          <div>
            <form
              onSubmit={HandleSearch}
              className="flex justify-stretch items-center py-1 bg-yellow-300"
            >
              <div>
                <input
                  className="w-[200px] ml-2 rounded-lg outline-none px-2"
                  type="text"
                  onChange={ChangeSearch}
                ></input>
              </div>
              <div>
                <button type="submit">
                  <img
                    className="w-[50px] p-2"
                    src="./Icon/magnifying-glass-solid.svg"
                    alt=""
                  ></img>
                </button>
              </div>
            </form>
          </div>
          <div className="h-[580px] overflow-auto">
            {isWait ? (
              <div className="flex flex-col justify-center items-center">
                <div className="w-[230px] h-[60px] bg-white rounded-lg mt-2 border-2 border-white animate-pulse"></div>
                <div className="w-[230px] h-[60px] bg-white rounded-lg mt-2 border-2 border-white animate-pulse"></div>
                <div className="w-[230px] h-[60px] bg-white rounded-lg mt-2 border-2 border-white animate-pulse"></div>
              </div>
            ) : (
              <>
                {Search
                  ? SearchNote.map((Ar) => (
                      <div className="flex justify-center items-center">
                        <button
                          onClick={() => SelectNote(Ar._id)}
                          className={
                            DataNote._id === Ar._id
                              ? "w-full bg-yellow-300 mx-3 rounded-lg flex items-center justify-center mt-2 py-2 border-2 border-white"
                              : "w-full bg-white mx-3 rounded-lg flex items-center justify-center mt-2 py-2 border-2 border-white"
                          }
                        >
                          <div>
                            {Ar.Title === "" ? (
                              <p className="truncate w-[150px] h-[40px]">
                                Empty
                              </p>
                            ) : (
                              <p className="truncate w-[150px] h-[40px]">
                                {Ar.Title}
                              </p>
                            )}
                          </div>
                        </button>
                      </div>
                    ))
                  : StorageNote.map((Ar) => (
                      <div className="flex justify-center items-center">
                        <button
                          onClick={() => SelectNote(Ar._id)}
                          className={
                            DataNote._id === Ar._id
                              ? "w-full bg-yellow-300 mx-3 rounded-lg flex items-center justify-center mt-2 py-2 border-2 border-white"
                              : "w-full bg-white mx-3 rounded-lg flex items-center justify-center mt-2 py-2 border-2 border-white"
                          }
                        >
                          <div>
                            {Ar.Title === "" ? (
                              <p className="truncate w-[150px] h-[40px]">
                                Empty
                              </p>
                            ) : (
                              <p className="truncate w-[150px] h-[40px]">
                                {Ar.Title}
                              </p>
                            )}
                          </div>
                        </button>
                      </div>
                    ))}
                {Search ? (
                  <div></div>
                ) : (
                  <div className="flex justify-center items-center">
                    <button
                      onClick={AddNote}
                      className={
                        !Account.Email && StorageNote.length === 3
                          ? "w-full bg-white mx-3 rounded-lg flex items-center justify-center mt-2 opacity-50 cursor-none pointer-events-none"
                          : "w-full bg-white mx-3 rounded-lg flex items-center justify-center mt-2"
                      }
                    >
                      <div>
                        <img
                          className="w-[50px] p-3"
                          src="./Icon/plus-solid.svg"
                          alt=""
                        ></img>
                      </div>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col ml-[250px]">
        <div className="flex justify-between items-center w-full bg-yellow-200">
          <div className="p-2">
            {DataNote.Title || StorageNote.length !== 0 ? (
              <input
                onChange={ChangeTitle}
                name="Title"
                value={DataNote.Title}
                className="bg-yellow-200 outline-none truncate w-[500px]"
              ></input>
            ) : (
              <input readOnly className="bg-yellow-200 outline-none"></input>
            )}
          </div>

          <div className="flex justify-center items-center gap-5">
            {DataNote._id ? (
              <>
                <div
                  className={
                    DataNote.Prioritize === 0
                      ? "relative w-[35px] h-[35px]"
                      : "relative w-[35px] h-[35px] border-2 border-yellow-400 rounded-full bg-white"
                  }
                >
                  <button
                    onClick={ChangePrioritize}
                    className="absolute flex justify-center items-center w-full h-full top-0 z-[1]"
                  >
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                        fill={DataNote.Prioritize === 0 ? "#000" : "#ffda00"}
                        className="w-[30px]"
                      >
                        <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                      </svg>
                    </div>
                  </button>
                </div>
                <div className="relative w-[25px] h-[30px]">
                  <button
                    onClick={DeleteNote}
                    className="absolute flex justify-center items-center top-0 z-[1]"
                  >
                    <div>
                      <img
                        className="w-[25px]"
                        src="./Icon/trash-solid.svg"
                        alt=""
                      ></img>
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <div></div>
            )}

            <div className="pl-3 pr-2 bg-gray-500 rounded-l-full">
              <Link to={Account.Email ? "/Account" : "/SignIn"}>
                <img
                  className="w-[50px] p-2"
                  src="./Icon/circle-user-solid.svg"
                  alt=""
                ></img>
              </Link>
            </div>
          </div>
        </div>
        {StorageNote.length === 0 || DataNote._id === "" ? (
          <div className="flex flex-col justify-center items-center w-full h-[600px] opacity-70">
            <div>
              <img
                className="w-[100px]"
                src="./Icon/feather-solid.svg"
                alt=""
              ></img>
            </div>
            <div>
              {StorageNote.length === 0 ? (
                <p>Bạn chưa có Note nào tạo sẳn!</p>
              ) : (
                <p>Hãy chọn Note!</p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <ReactQuill
              className="h-[590px]"
              theme="snow"
              value={ContentNote}
              onChange={setContentNote}
              modules={modules}
            ></ReactQuill>
          </div>
        )}
      </div>
    </div>
  );
}
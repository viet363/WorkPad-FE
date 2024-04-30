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
  const [ResultStatus, setResultStatus] = useState({
    Notes: true,
    EditContent: true,
    Message: "",
  });

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

  const GetDay = () => {
    const DateTime = new Date();
    const Ngay = DateTime.getDate();
    const Thang = DateTime.getMonth();
    const Nam = DateTime.getFullYear();
    return Ngay + "/" + Thang + "/" + Nam;
  };

  const RandomID = () => {
    return (Math.floor(Math.random() * 900000) + 100000).toString();
  };

  const AddNotes = () => {
    const NewNote = {
      _id: RandomID(),
      Title: "New Note",
      Prioritize: 0,
      DateCreate: GetDay(),
      EmailCreate: "",
      Content: "",
    };
    if (!Account.Email) {
      setDataNote(NewNote);
      setContentNote("");
      setStorageNote([...StorageNote, NewNote]);
    } else {
      setDataNote({});
      setContentNote("");
      axios
        .post("http://localhost:9000/Note/SaveNote", {
          Title: NewNote.Title,
          Prioritize: NewNote.Prioritize,
          Email: Account.Email,
          Content: NewNote.Content,
        })
        .then(() => {
          axios
            .post("http://localhost:9000/Note/GetNoteByEmail", {
              Email: Account.Email,
            })
            .then((rs) => {
              if (rs.data && rs.data.length >= 1) {
                setStorageNote(
                  rs.data.sort((a, b) => b.Prioritize - a.Prioritize)
                );
              } else {
                setStorageNote([]);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const SelectNote = (ID) => {
    const Note = StorageNote.find((i) => i._id === ID);
    setDataNote(Note);
    setContentNote(Note.Content);
  };

  const ChangeTitle = (e) => {
    setDataNote({ ...DataNote, [e.target.name]: e.target.value });
  };

  const DeleteSearchNote = () => {
    if (SearchNote.length >= 1) {
      const HadDelete = SearchNote.filter((i) => i._id !== DataNote._id);
      setSearchNote(HadDelete.sort((a, b) => b.Prioritize - a.Prioritize));
    }
  };

  const DeleteNote = () => {
    if (!Account.Email) {
      const HadDelete = StorageNote.filter((i) => i._id !== DataNote._id);
      setStorageNote(HadDelete.sort((a, b) => b.Prioritize - a.Prioritize));
      setDataNote({
        _id: "",
        Title: "",
        Prioritize: 0,
        DateCreate: "",
        EmailCreate: "",
        Content: "",
      });
      setContentNote("");
      DeleteSearchNote();
    } else {
      axios
        .post("http://localhost:9000/Note/DeleteNote", { _id: DataNote._id })
        .then(() => {
          axios
            .post("http://localhost:9000/Note/GetNoteByEmail", {
              Email: Account.Email,
            })
            .then((rs) => {
              if (rs.data && rs.data.length >= 1) {
                setStorageNote(
                  rs.data.sort((a, b) => b.Prioritize - a.Prioritize)
                );
                setDataNote({
                  _id: "",
                  Title: "",
                  Prioritize: 0,
                  DateCreate: "",
                  EmailCreate: "",
                  Content: "",
                });
                setContentNote("");
                DeleteSearchNote();
              } else {
                setStorageNote([]);
                setDataNote({
                  _id: "",
                  Title: "",
                  Prioritize: 0,
                  DateCreate: "",
                  EmailCreate: "",
                  Content: "",
                });
                setContentNote("");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const ChangePrioritize = () => {
    if (DataNote.Prioritize === 0) {
      setDataNote({ ...DataNote, Prioritize: 1 });
      setResultStatus({ ...ResultStatus, Notes: false });
    } else {
      setDataNote({ ...DataNote, Prioritize: 0 });
      setResultStatus({ ...ResultStatus, Notes: false });
    }
  };

  const ChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  //Start Page
  useEffect(() => {
    if (!Account.Email) {
      const GetNote = window.localStorage.getItem("Notes");
      if (GetNote) {
        setStorageNote(JSON.parse(GetNote));
      } else {
        setStorageNote([]);
      }
    } else {
      const GetNote = window.localStorage.getItem("Notes");
      if (GetNote) {
        const Notes = JSON.parse(GetNote);
        Notes.forEach((i) => {
          axios
            .post("http://localhost:9000/Note/SaveNote", {
              Title: i.Title,
              Prioritize: i.Prioritize,
              Email: Account.Email,
              Content: i.Content,
            })
            .then((rs) => {
              setResultStatus({ ...ResultStatus, Message: rs.data.Status });
            })
            .catch((err) => {
              console.log(err);
            });
        });
        window.localStorage.setItem("Notes", "");
        axios
          .post("http://localhost:9000/Note/GetNoteByEmail", {
            Email: Account.Email,
          })
          .then((rs) => {
            if (rs.data && rs.data.length >= 1) {
              setStorageNote(
                rs.data.sort((a, b) => b.Prioritize - a.Prioritize)
              );
            } else {
              setStorageNote([]);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        axios
          .post("http://localhost:9000/Note/GetNoteByEmail", {
            Email: Account.Email,
          })
          .then((rs) => {
            if (rs.data && rs.data.length >= 1) {
              setStorageNote(
                rs.data.sort((a, b) => b.Prioritize - a.Prioritize)
              );
            } else {
              setStorageNote([]);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Account.Email]);

  //Save to LocalStorage
  useEffect(() => {
    if (!Account.Email) {
      if (StorageNote.length > 0) {
        window.localStorage.setItem("Notes", JSON.stringify(StorageNote));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [StorageNote]);

  //Handle Search
  useEffect(() => {
    if (Search) {
      const StringSearch = new RegExp(Search, "i");
      const FindNote = StorageNote.filter((i) => StringSearch.test(i.Title));
      setSearchNote(FindNote);
    } else {
      setSearchNote([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Search]);

  useEffect(() => {
    setTimeout(() => {
      setResultStatus({ ...ResultStatus, Notes: true });
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ResultStatus.Notes]);

  //Change Prioritize
  useEffect(() => {
    if (!Account.Email) {
      if (StorageNote && StorageNote.length >= 1) {
        const TitleChange = StorageNote.map((i) =>
          i._id === DataNote._id ? { ...DataNote } : i
        );
        setStorageNote(TitleChange.sort((a, b) => b.Prioritize - a.Prioritize));
      }
    } else {
      if (DataNote._id) {
        axios
          .post("http://localhost:9000/Note/ChangePrioritize", {
            _id: DataNote._id,
            Prioritize: DataNote.Prioritize,
          })
          .then(() => {
            axios
              .post("http://localhost:9000/Note/GetNoteByEmail", {
                Email: Account.Email,
              })
              .then((rs) => {
                if (rs.data && rs.data.length >= 1) {
                  setStorageNote(
                    rs.data.sort((a, b) => b.Prioritize - a.Prioritize)
                  );
                } else {
                  setStorageNote([]);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DataNote.Prioritize]);

  //Save Change Title
  useEffect(() => {
    if (!Account.Email) {
      if (StorageNote && StorageNote.length >= 1) {
        const TitleChange = StorageNote.map((i) =>
          i._id === DataNote._id ? { ...DataNote } : i
        );
        setStorageNote(TitleChange.sort((a, b) => b.Prioritize - a.Prioritize));
      }
    } else {
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
                  if (rs.data && rs.data.length >= 1) {
                    setStorageNote(
                      rs.data.sort((a, b) => b.Prioritize - a.Prioritize)
                    );
                  } else {
                    setStorageNote([]);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        }, 1000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DataNote.Title]);

  //Save Content Change current note
  useEffect(() => {
    if (!Account.Email) {
      setDataNote({ ...DataNote, Content: ContentNote });
    } else {
      setDataNote({ ...DataNote, Content: ContentNote });
      if (DataNote._id) {
        setTimeout(() => {
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
                  if (rs.data && rs.data.length >= 1) {
                    setStorageNote(
                      rs.data.sort((a, b) => b.Prioritize - a.Prioritize)
                    );
                  } else {
                    setStorageNote([]);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        }, 1000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContentNote]);

  //Save Content Change in notes
  useEffect(() => {
    if (!Account.Email) {
      if (StorageNote && StorageNote.length >= 1) {
        const NoteChange = StorageNote.map((i) =>
          i._id === DataNote._id ? { ...DataNote, Content: ContentNote } : i
        );
        setStorageNote(NoteChange.sort((a, b) => b.Prioritize - a.Prioritize));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DataNote.Content]);

  useEffect(() => {
    if(DataNote._id && SearchNote && SearchNote.length >= 1){
      const Change = SearchNote.map(i => i._id === DataNote._id ? {...DataNote} : i)
      setSearchNote(Change)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[DataNote])

  //Hidden SideBar
  useEffect(() => {
    SetIsSideBar({ Sidebar: false, Footer: false });
  }, [SetIsSideBar]);

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
          <div className="flex w-full justify-center items-center py-1 bg-yellow-300">
            <div>
              <input
                className="w-[230px] rounded-lg outline-none px-2"
                type="text"
                onChange={ChangeSearch}
                placeholder="Search..."
              ></input>
            </div>
          </div>
          <div className="h-[580px] overflow-auto">
            {ResultStatus.Notes ? (
              <>
                {Search
                  ? SearchNote.map((Ar) => (
                      <div className="flex justify-center items-center">
                        <button
                          onClick={() => SelectNote(Ar._id)}
                          className={
                            DataNote._id === Ar._id
                              ? "w-full bg-yellow-300 mx-3 rounded-lg flex items-center justify-center mt-2 py-2 border-2 border-white"
                              : Ar.Prioritize === 0
                              ? "w-full bg-white mx-3 rounded-lg flex items-center justify-center mt-2 py-2 border-2 border-white"
                              : "w-full bg-white mx-3 rounded-lg flex items-center justify-center mt-2 py-2 border-2 border-yellow-400"
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
                              : Ar.Prioritize === 0
                              ? "w-full bg-white mx-3 rounded-lg flex items-center justify-center mt-2 py-2 border-2 border-white"
                              : "w-full bg-white mx-3 rounded-lg flex items-center justify-center mt-2 py-2 border-2 border-yellow-400"
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
                      onClick={() => AddNotes()}
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
            ) : (
              <div className="flex flex-col justify-center items-center">
                <div className="w-[230px] h-[60px] bg-white rounded-lg mt-2 border-2 border-white animate-pulse"></div>
                <div className="w-[230px] h-[60px] bg-white rounded-lg mt-2 border-2 border-white animate-pulse"></div>
                <div className="w-[230px] h-[60px] bg-white rounded-lg mt-2 border-2 border-white animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col ml-[250px]">
        <div className="flex justify-between items-center w-full bg-yellow-200">
          <div className="p-2">
            {DataNote._id ? (
              <input
                name="Title"
                value={DataNote.Title}
                onChange={ChangeTitle}
                className="bg-yellow-200 outline-none truncate w-[500px]"
              ></input>
            ) : (
              <input
                readOnly
                value={""}
                className="bg-yellow-200 outline-none"
              ></input>
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
                    onClick={() => ChangePrioritize()}
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
                    onClick={() => DeleteNote()}
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
          <>
            {ResultStatus.EditContent ? (
              <div>
                <ReactQuill
                  className="h-[590px]"
                  theme="snow"
                  value={ContentNote}
                  onChange={setContentNote}
                  modules={modules}
                ></ReactQuill>
              </div>
            ) : (
              <div>
                <div className="w-full h-[60px] bg-slate-300 animate-pulse"></div>
                <div className="w-full h-[590px] bg-slate-200 animate-pulse"></div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
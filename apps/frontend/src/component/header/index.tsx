import React, { useEffect, useState, useRef } from 'react';
import avatar60 from '../../assets/avatar_60_dancing.png'
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
import mainLogo from '../../assets/main_logo.png'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomModal from '../customModal';
import { CallbackFunctions, CreateAvatarDataSchema, CreateElementDataSchema, CreateMapDataSchema, CreateSpaceDataSchema, ModalStateUnion } from '../../types';
// import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';


interface HeaderProps {
  tab: string
  setTab: React.Dispatch<React.SetStateAction<string>>;
}
interface userProfileSchema {
  name: string,
  userName: string
}

const Header: React.FC<HeaderProps> = ({ tab, setTab }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [EditNameOpen, setEditNameOpen] = useState(false);
  const [myModal, setMyModal] = useState<ModalStateUnion>({
    open: false,
    modalName: "",
    callback: async () => { },
  })
  const [userProfile, setUserProfile] = useState<userProfileSchema>({
    name: "",
    userName: ""
  })
  const hasFetchedUserInfo = useRef(false);



  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const toggleEditName = () => {
    setEditNameOpen(!EditNameOpen)
  }
  const handleSignOut = async () => {
    try {
      const token = localStorage.getItem('token');
      localStorage.removeItem('token');
      const HTTP_SERVER_URL = import.meta.env.VITE_HTTP_SERVER_URL
      const url = `${HTTP_SERVER_URL}/sign-out`
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(token)
      })
      toast.success("Signout Successfully", {
        position: "top-center"
      });
      setTimeout(() => {
        navigate('/signin')
      }, 2000)
    } catch (err) {
      toast.error("Something went wrong. Unable to sign out", {
        position: "top-center"
      })
    }
  }
  const closeModal = () => {
    setMyModal((prev: ModalStateUnion) => {
      return {
        ...prev,
        open: false,
        modalName: "",
      }
    })
  }
  // const createElement = async (data: CreateElementDataSchema) => {
  //   try {
  //     const HTTP_SERVER_URL = import.meta.env.VITE_HTTP_SERVER_URL
  //     const url = `${HTTP_SERVER_URL}/admin/element`;
  //     const token = localStorage.getItem('token');
  //     const resp = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify(data)
  //     })
  //     const respJson = await resp.json()
  //     console.log(respJson)
  //     toast.success("Element is Created Successfully", {
  //       position: "top-center"
  //     })
  //   } catch (err) {
  //     toast.error("Unable to create Element", {
  //       position: "top-center"
  //     })
  //     console.log(err)
  //   }
  // }
  // const createAvatar = async (data: CreateAvatarDataSchema) => {
  //   try {
  //     const HTTP_SERVER_URL = import.meta.env.VITE_HTTP_SERVER_URL
  //     const url = `${HTTP_SERVER_URL}/admin/avatar`;
  //     const token = localStorage.getItem('token');
  //     const resp = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify(data)
  //     })
  //     const respJson = await resp.json()
  //     console.log(respJson)
  //     toast.success("Avatar is Created Successfully", {
  //       position: "top-center"
  //     })
  //   } catch (err) {
  //     toast.error("Unable to create Element", {
  //       position: "top-center"
  //     })
  //     console.log(err)
  //   }
  // }
  const createSpace = async (data: CreateSpaceDataSchema) => {
    try {
      debugger;
      const HTTP_SERVER_URL = import.meta.env.VITE_HTTP_SERVER_URL
      const url = `${HTTP_SERVER_URL}/space`;
      const token = localStorage.getItem('token');
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      if (!resp.ok) {
        throw Error("Unable to create space")
      }
      const respJson = await resp.json()
      console.log(respJson)
      toast.success("Avatar is Created Successfully", {
        position: "top-center"
      })
      closeModal();
    } catch (err) {
      toast.error("Unable to create Element", {
        position: "top-center"
      })
      console.log(err)
    }
  }
  // const createMap = async (data: CreateMapDataSchema) => {
  //   try {
  //     debugger;
  //     const HTTP_SERVER_URL = import.meta.env.VITE_HTTP_SERVER_URL
  //     const url = `${HTTP_SERVER_URL}/admin/map`;
  //     const token = localStorage.getItem('token');
  //     const resp = await fetch(url, {
  //       method: "POST",

  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify(data)
  //     })
  //     const respJson = await resp.json()
  //     console.log(respJson)
  //     toast.success("Avatar is Created Successfully", {
  //       position: "top-center"
  //     })
  //   } catch (err) {
  //     toast.error("Unable to create Element", {
  //       position: "top-center"
  //     })
  //     console.log(err)
  //   }
  // }
  function extractNameFromEmail(email: string): string {
    // if (!email.includes("@")) {
    //   throw new Error("Invalid email format");
    // }
    const namePart = email.split("@")[0];
    const formattedName = namePart
      .split(/[\W_]+/)
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    return formattedName ?? "";
  }
  const getUserInfo = async () => {
    if (hasFetchedUserInfo.current) return;
    hasFetchedUserInfo.current = true;
    try {
      const token = localStorage.getItem('token');
      const HTTP_SERVER_URL = import.meta.env.VITE_HTTP_SERVER_URL
      const url = `${HTTP_SERVER_URL}/user/user-info`
      const resp = await fetch(url, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      const respJson = await resp.json();
      console.log(respJson);
      if (!respJson.username) {
        throw Error("cannot get user information");
      }
      const user = {
        name: extractNameFromEmail(respJson?.username),
        userName: respJson?.username,
      }
      setUserProfile(user)

    } catch (err) {
      console.log("unable to fetch user info: ", err)
      toast.error("Please Login to continue.", {
        position: 'top-center'
      })
      navigate('/signin')
    }
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  return (
    <header>
      <nav className="bg-[#333a64] py-3">
        <div className="flex flex-wrap justify-between items-center px-8">
          <div className="flex items-center space-x-6">
            <a href="/" className="flex items-center">
              <img src={mainLogo} alt="metaverse" className='w-14 h-14' />
            </a>
            <div className="hidden lg:flex items-center space-x-6">
              <button type='button' className={`flex gap-2 items-center font-bold text-white px-5 py-2 rounded-lg hover:bg-[#4c5381] ${tab == 'event' ? 'bg-[#4c5381] ' : ''}`} onClick={() => setTab("event")}>
                <CalendarMonthIcon className='!w-4 !h-4' />
                <span className="align-middle">Events</span>
              </button>
              <button type='button' className={`flex gap-2 items-center font-bold text-white px-5 py-2 rounded-lg hover:bg-[#4c5381] ${tab == 'space' ? 'bg-[#4c5381] ' : ''}`} onClick={() => setTab("space")}>
                <WorkspacesIcon className='!w-4 !h-4' />
                <span className="align-middle">My Spaces</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center space-x-2 text-white ${profileOpen ? 'bg-[#454d7b]' : ''} rounded-lg p-1 px-3`}
              >
                <div className="w-8 h-8 bg-black rounded-full overflow-hidden">
                  <img src={avatar60} alt="avatar" className='w-11 h-11 rounded-full' />
                </div>
                <span className="hidden lg:inline-block">lucky</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-[#454d7b] ring-1 ring-black ring-opacity-5">
                  <div className="p-4">
                    <div onClick={toggleEditName}>
                      <div className="text-white font-medium mb-1">Profile</div>
                      <div className="text-lg text-white font-semibold mb-1">{userProfile.name}</div>
                      <div className="text-gray-400 text-sm mb-4">{userProfile.userName}</div>
                    </div>

                    <div className="space-y-2">
                      <button className="w-full text-left flex items-center space-x-3 text-white hover:bg-gray-700 p-2 rounded-lg">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        <span>Edit Character</span>
                      </button>

                      <button onClick={handleSignOut} className="w-full text-left flex items-center space-x-3 text-white hover:bg-gray-700 p-2 rounded-lg">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* <button className="flex items-center gap-2 font-semibold text-[#282d4e] bg-[#06d6a0] hover:bg-[#76dbc4] px-6 py-2 rounded-lg hover:bg-[#00a89d]" onClick={() => {
              setMyModal((prev) => {
                return {
                  ...prev,
                  open: true,
                  modalName: 'create-element',
                  callback: createElement
                }
              })
            }}>
              <AddCircleIcon />
              <span>
                Create Element
              </span>
            </button>
            <button className="flex items-center gap-2 font-semibold text-[#282d4e] bg-[#06d6a0] hover:bg-[#76dbc4] px-4 py-2 rounded-lg hover:bg-[#00a89d]" onClick={() => {
              setMyModal((prev) => {
                return {
                  ...prev,
                  open: true,
                  modalName: 'create-map',
                  callback: createMap
                }
              })
            }}>
              <AddLocationAltIcon />
              <span>
                Create Map
              </span>
            </button>
            <button className="flex items-center gap-2 font-semibold text-[#282d4e] bg-[#06d6a0] hover:bg-[#76dbc4] px-4 py-2 rounded-lg hover:bg-[#00a89d]" onClick={() => {
              setMyModal((prev) => {
                return {
                  ...prev,
                  open: true,
                  modalName: 'create-avatar',
                  callback: createAvatar
                }
              })
            }}>
              <img src={avatar60} alt="avatar" className='w-5 h-6 rounded-full' />
              <span>
                Create Avatar
              </span>
            </button> */}
            <button className="flex items-center gap-2 font-semibold text-[#282d4e] bg-[#06d6a0] hover:bg-[#76dbc4] px-4 py-2 rounded-lg hover:bg-[#00a89d]" onClick={() => {
              setMyModal((prev) => {
                return {
                  ...prev,
                  open: true,
                  modalName: 'create-space',
                  callback: async (data: CreateSpaceDataSchema) => {
                    await createSpace(data)
                  }
                }
              })
            }}>
              <RocketLaunchIcon />
              <span>
                Create Space
              </span>
            </button>

            <button
              onClick={toggleMenu}
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-400 rounded-lg lg:hidden hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`w-6 h-6 ${menuOpen ? 'hidden' : 'block'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden mt-4">
            <ul className="flex flex-col space-y-2">
              <li>
                <a href="/events" className="block py-2 px-4 text-white hover:bg-gray-700 rounded-lg">
                  Events
                </a>
              </li>
              <li>
                <a href="/spaces" className="block py-2 px-4 text-white hover:bg-gray-700 rounded-lg">
                  My Spaces
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
      <ToastContainer />
      {
        myModal.open && <CustomModal modalName={myModal.modalName} cancel={closeModal} callback={myModal.callback as CallbackFunctions<
          CreateElementDataSchema | CreateMapDataSchema | CreateAvatarDataSchema | CreateSpaceDataSchema
        >} />
      }
    </header>
  );
};

export default Header;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from "../utils/APIRoutes";
import { Buffer } from "buffer";

export default function SetAvatar() {
  const api = "https://api.multiavatar.com/2ac6mqxXR04CIV";
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoader] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
 useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    }
  }, [navigate]); 

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar !", toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));

        navigate("/");
      } else {
        toast.error("Error setting avatar.Please try again", toastOptions);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [];
        for (let i = 0; i < 4; i++) {
          const image = await axios.get(
            `${api}/${Math.round(Math.random() * 1000)}`
          );
          const buffer = new Buffer(image.data);
          data.push(buffer.toString("base64"));
        }
        setAvatars(data);
        setIsLoader(false);
      } catch (error) {
        // Handle any errors that occur during the data fetching.
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="wrapper">
            <div className="title-container">
              <h1>Select your profile avatar</h1>
            </div>
            <div className="avatars">
              {avatars.map((avatar, index) => {
                return (
                  <div
                    key={index}
                    className={`avatar ${
                      selectedAvatar === index ? "selected" : ""
                    }`}
                  >
                    <img
                      src={`data:image/svg+xml;base64,${avatar}`}
                      alt="avatar"
                      onClick={() => setSelectedAvatar(index)}
                    />
                  </div>
                );
              })}
            </div>
            <button className="submit-btn" onClick={setProfilePicture}>
              Set Avatar
            </button>
          </div>
        </Container>
      )}
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  .wrapper {
    padding: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #00000076;
    gap: 3rem;
    border-radius: 0.6rem;
    box-shadow: 5px 10px 8px 10px transparent;
    z-index: 1;

    .loader {
      max-inline-size: 100%;
    }
    .title-container {
      h1 {
        color: white;
      }
    }
    .avatars {
      display: flex;
      gap: 2rem;
      .avatar {
        border: 0.3rem solid transparent;
        border-radius: 50% 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.4s ease-in-out;
        img {
          height: 5rem;
        }
      }
      .selected {
        border: 0.3rem solid #4e0eff;
      }
    }
    .submit-btn {
      background-color: #997af0;
      color: white;
      padding: 1rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 0.5s ease-in-out;
      z-index: 1;
      &:hover {
        background-color: #4e0eff;
      }
    }
  }
`;

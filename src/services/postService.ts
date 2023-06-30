import axios from "axios";
import { UserData } from "auth0";

type Emailee = {
  username: string;
  email: string;
};

export const updateUsername = async (
  userId: string,
  username: string,
  token: string
): Promise<UserData> => {
  const config = {
    url: `${import.meta.env.VITE_AUTH0_API_URL}/api/auth/${userId}`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: { username },
  };
  const { data }: { data: UserData } = await axios(config);
  return data;
};

export const deleteAccount = async (
  userId: string,
  token: string
): Promise<void> => {
  const config = {
    url: `${import.meta.env.VITE_AUTH0_API_URL}/api/auth/${userId}`,
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  await axios(config);
};

export const getOpponents = async (
  token: string,
  username: string
): Promise<string[]> => {
  const config = {
    url: `${import.meta.env.VITE_AUTH0_API_URL}/api/auth`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data }: { data: string[] } = await axios(config);
  const opponents = data.filter((name) => name !== username);
  return opponents;
};

export const getGames = async (
  username: string,
  token: string
): Promise<Game[]> => {
  const config = {
    url: `${import.meta.env.VITE_AUTH0_API_URL}/api/games/${username}`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data }: { data: Game[] } = await axios(config);
  return data;
};

export const getEmailee = async (
  username: string,
  token: string
): Promise<Emailee> => {
  const config = {
    url: `${import.meta.env.VITE_AUTH0_API_URL}/api/emailees/${username}`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data }: { data: Emailee } = await axios(config);
  return data;
};

export const deleteEmailee = async (
  username: string,
  token: string
): Promise<number> => {
  const config = {
    url: `${import.meta.env.VITE_AUTH0_API_URL}/api/emailees/${username}`,
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data }: { data: number } = await axios(config);
  return data;
};

export const postEmailee = async (
  payload: Emailee,
  token: string
): Promise<Emailee> => {
  const config = {
    url: `${import.meta.env.VITE_AUTH0_API_URL}/api/emailees`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: payload,
  };
  const { data }: { data: Emailee } = await axios(config);
  return data;
};

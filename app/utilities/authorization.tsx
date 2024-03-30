import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
} from "react";
import dayjs from "dayjs";

export const getAuthorization = (token: string) => {
  return {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
};

export const setAuthorization = (token: string) => {
  localStorage.setItem("token", token);
};

export const clearAuthorization = () => {
  localStorage.removeItem("token");
};

export const initialUserContextData = {
  token: undefined,
  expireAt: undefined,
  email: undefined,
  role: undefined,
  userFullName: undefined,
  username: undefined,
};

export const UserContext = createContext<IUserContextData>(
  initialUserContextData
);
export type IUserContextData = {
  token?: string;
  expireAt?: number;
  email?: string;
  role?: string;
  userFullName?: string;
  username?: string;
};

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = ({
  children,
}: {
  children: JSX.Element | React.ReactNode;
}) => {
  const [userData, setUserData] = useState<IUserContextData | null>(null);

  const setUserContext = useCallback(
    (newState: IUserContextData) => {
      setUserData({ ...userData, ...newState });
    },
    [userData]
  );

  const getUserContextValue = useCallback(
    () => ({ setUserContext, ...userData }),
    [setUserContext, userData]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const tokenData = JSON.parse(token);
      if (dayjs.unix(tokenData.expireAt).isBefore(dayjs())) {
        localStorage.removeItem("token");
        setUserData(initialUserContextData);
      } else {
        setUserData({
          token,
          expireAt: tokenData.expireAt,
          ...tokenData,
        });
      }
    }
  }, [setUserData]);

  return (
    <UserContext.Provider value={getUserContextValue()}>
      {children}
    </UserContext.Provider>
  );
};

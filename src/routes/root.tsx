import { FC } from "react";
import { Auth0Provider, AppState } from "@auth0/auth0-react";
import { useNavigate, Outlet } from "react-router-dom";

const Root: FC = () => {
  const navigate = useNavigate();
  const domain: string = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId: string = import.meta.env.VITE_AUTH0_SPA_CLIENT_ID;
  const redirectUri: string = import.meta.env.VITE_AUTH0_CALLBACK_URL;
  const audience: string = import.meta.env.VITE_AUTH0_AUDIENCE;

  const onRedirectCallback = (appState: AppState | undefined): void => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  if (!(domain && clientId && redirectUri && audience)) {
    return null;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience: audience,
        redirect_uri: redirectUri,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      <Outlet />
    </Auth0Provider>
  );
};

export default Root;

import React, { useCallback, useState } from 'react';
import { AuthenticationResult, InteractionType } from '@azure/msal-browser';
import decode from "jwt-decode"
import { useMsal, useIsAuthenticated, useMsalAuthentication } from "@azure/msal-react";

// using a scope is not technically necessary but is required when using RBAC
// Roles in the Accss Token (so it's basically required):
const SCOPES = [process.env.REACT_APP_SCOPE || "Please update the .env.local file (See The README!)"]

export function App() {
  const isAuthenticated = useIsAuthenticated();

  const { login, result, error: MSAL_error } = useMsalAuthentication(InteractionType.Popup);
  const [login_error, set_login_error] = useState<string>()
  const [roles, set_roles] = useState<string[]>()
  const [accessToken, set_accessToken] = useState<any>()

  // https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md#acquiring-an-access-token
  const { instance: MSALinstance, accounts, inProgress } = useMsal();


  // const MSAL = useContext(MsalContext)

  const onLogOut = useCallback(async () => {
    MSALinstance.logoutPopup();
  }, [MSALinstance])

  const onLogIn = useCallback(async () => {
    try {
      const creds = await login();
      console.log("login credentials:", creds)
      if (creds === null)
        throw new Error("no creds")
      if (creds.account === null)
        throw new Error("no account")
    } catch (err) {
      set_login_error((err as any).message || "Unknown error")
    }
  }, [login])

  const onGetToken = useCallback(async () => {
    try {
      let authenticationResult: AuthenticationResult
      if (accounts && accounts.length === 1) {
        try {
          authenticationResult = await MSALinstance.acquireTokenSilent({
            scopes: SCOPES,
            account: accounts[0],
          });
        } catch (silent_error) {
          console.log("acquireTokenSilent failed with error: ", silent_error)
          authenticationResult = await MSALinstance.acquireTokenPopup({
            scopes: SCOPES,
          });
        }
      } else {
        authenticationResult = await MSALinstance.acquireTokenPopup({
          scopes: SCOPES,
        });
      }
      console.log("authenticationResult response:", authenticationResult)
      const accessToken: any = decode(authenticationResult.accessToken);
      set_accessToken(accessToken)
      set_roles(accessToken.roles)
    } catch (err) {
      set_login_error((err as any).message || "Unknown error")
    }
  }, [login])

  return (
    <>
      <h1>Demo App with MSAL-react (Hooks)</h1>
      <h3>Configuration</h3>
      <ul>
        <li>Scope: <code style={{ backgroundColor: "#dddddd" }}>{process.env.REACT_APP_SCOPE || "Please add to .env.local"}</code></li>
        <li>Client ID: <code style={{ backgroundColor: "#dddddd" }}>{process.env.REACT_APP_CLIENT_ID || "Please add to .env.local"}</code></li>
        <li>Authority: <code style={{ backgroundColor: "#dddddd" }}>{process.env.REACT_APP_AUTHORITY || "Please add to .env.local"}</code></li>

      </ul>

      {isAuthenticated && (
        <div>
          <button onClick={onGetToken}>get token</button>
          <button onClick={onLogOut}>Click to sign out!</button>
        </div>
      )}
      {!isAuthenticated && (
        <button onClick={onLogIn}>Click to sign in!</button>
      )}
      {inProgress === "login" && <span>Login is currently in progress!</span>}
      {login_error ? <p style={{ color: "red" }}>Something went wrong: {login_error}</p> : null}
      {MSAL_error ? <p style={{ color: "red" }}>MSAL eror: {MSAL_error}</p> : null}
      <div>
        <h3>User Accounts</h3>
        {accounts ? (<ul>{
          accounts.map((a, i) => (<li key={i}><pre>{JSON.stringify(a, null, 4)}</pre></li>))
        }</ul>) : <p>None yet</p>}
      </div>
      <div>
        <h3>Access Token</h3>
        {roles ? <pre>{JSON.stringify(accessToken, null, 2)}</pre> : <p>None yet</p>}
      </div>
      <div>
        <h3>User Roles (Access Token)</h3>
        {roles ? (<ul>{roles.map(r => (<li key={r}>{r}</li>))}</ul>) : <p>None yet</p>}
      </div>
    </>
  );
}

export default App
